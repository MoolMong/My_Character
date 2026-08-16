#!/usr/bin/env python3
"""Deterministically derive replaceable layered-board assets from the supplied board.

The source PNG is never modified. A seeded GrabCut pass separates only the central
character from edge-connected paper inside a fixed working rectangle. OpenCV
inpainting reconstructs the newly exposed paper; all remapping is integer-only.
"""
from __future__ import annotations

import argparse
import hashlib
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/assets/character-board-v2.png"
OUT = ROOT / "src/assets/board-layers"
SOURCE_SHA256 = "63899dff4cc6fbd5e6858db0d230431ed700ac8bb0d1c8159931b79a670fc326"
FRAME_NAMES = ("neutral", "inhale", "peak", "settle")
FRAME_SHIFTS = (0, -1, -2, 1)
BODY_RECT = (354, 290, 412, 590)  # x, y, width, height; excludes every baked panel
CROP = (350, 285, 750, 885)  # fixed 400x600 runtime canvas
FLOOR_Y = 880


def source_array() -> np.ndarray:
    digest = hashlib.sha256(SOURCE.read_bytes()).hexdigest()
    if digest != SOURCE_SHA256:
        raise SystemExit(f"source checksum changed: {digest}")
    image = cv2.imread(str(SOURCE), cv2.IMREAD_COLOR)
    if image is None or image.shape != (1402, 1122, 3):
        raise SystemExit(f"unexpected source dimensions: {None if image is None else image.shape}")
    return image


def character_mask(image: np.ndarray) -> np.ndarray:
    cv2.setRNGSeed(20260816)
    labels = np.zeros(image.shape[:2], np.uint8)
    bg_model = np.zeros((1, 65), np.float64)
    fg_model = np.zeros((1, 65), np.float64)
    cv2.grabCut(image, labels, BODY_RECT, bg_model, fg_model, 8, cv2.GC_INIT_WITH_RECT)
    mask = np.where((labels == cv2.GC_FGD) | (labels == cv2.GC_PR_FGD), 255, 0).astype(np.uint8)

    # Limit extraction to the central character silhouette. This prevents the
    # nearby baked card rules and dotted explanation leaders entering a frame.
    bounds = np.zeros_like(mask)
    polygon = np.array([[370, 292], [665, 292], [683, 377], [750, 532], [742, 833],
                        [666, 846], [632, 880], [445, 880], [393, 848], [350, 770],
                        [354, 620], [382, 528]], np.int32)
    cv2.fillPoly(bounds, [polygon], 255)
    mask = cv2.bitwise_and(mask, bounds)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    # The held spear touches the glove, so the complete character is one component;
    # discard isolated paper flecks GrabCut may classify as foreground.
    count, component_labels, stats, _ = cv2.connectedComponentsWithStats(mask)
    largest = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA])) if count > 1 else 0
    mask = np.where(component_labels == largest, 255, 0).astype(np.uint8)
    # Stop before the illustrated ground/plant pixels while retaining both boots.
    mask[FLOOR_Y:, :] = 0
    return mask


def shifted_layer(image: np.ndarray, mask: np.ndarray, shift: int) -> np.ndarray:
    rgba = np.zeros((*mask.shape, 4), np.uint8)
    ys, xs = np.nonzero(mask)
    # Upper body/hair/cape breathe; hips taper to fixed legs via integer bands.
    offsets = np.zeros_like(ys)
    offsets[ys < 535] = shift
    offsets[(ys >= 535) & (ys < 650)] = int(np.sign(shift)) if shift else 0
    dest_y = ys + offsets
    valid = (dest_y >= 0) & (dest_y < FLOOR_Y)
    rgba[dest_y[valid], xs[valid], :3] = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)[ys[valid], xs[valid]]
    rgba[dest_y[valid], xs[valid], 3] = 255
    x0, y0, x1, y1 = CROP
    return rgba[y0:y1, x0:x1]


def generate() -> tuple[np.ndarray, np.ndarray, list[np.ndarray]]:
    image = source_array()
    mask = character_mask(image)
    frames = [shifted_layer(image, mask, shift) for shift in FRAME_SHIFTS]
    OUT.mkdir(parents=True, exist_ok=True)
    for name, frame in zip(FRAME_NAMES, frames):
        Image.fromarray(frame, "RGBA").save(OUT / f"character-{name}.png", optimize=False)

    checker = Image.new("RGB", (400, 600), "#171b2b")
    checker_draw = ImageDraw.Draw(checker)
    for y in range(0, 600, 24):
        for x in range(0, 400, 24):
            if (x // 24 + y // 24) % 2 == 0:
                checker_draw.rectangle((x, y, x + 23, y + 23), fill="#252b3c")
    composites = []
    for frame in frames:
        composite = checker.copy()
        composite.paste(Image.fromarray(frame, "RGBA"), mask=Image.fromarray(frame[:, :, 3]))
        composites.append(np.asarray(composite))
    thumbs = [Image.fromarray(c).resize((240, 360), Image.Resampling.NEAREST) for c in composites]
    sheet = Image.new("RGB", (960, 390), "#111522")
    draw = ImageDraw.Draw(sheet)
    for index, (name, thumb) in enumerate(zip(FRAME_NAMES, thumbs)):
        sheet.paste(thumb, (index * 240, 0))
        draw.text((index * 240 + 8, 368), name, fill="white")
    sheet.save(OUT / "verification-contact-sheet.png")
    thumbs[0].save(OUT / "verification-idle.gif", save_all=True, append_images=thumbs[1:], duration=[560, 420, 420, 560], loop=0, disposal=2)
    return image, mask, composites


def check() -> None:
    image, mask, composites = generate()
    frames = [np.asarray(Image.open(OUT / f"character-{name}.png")) for name in FRAME_NAMES]
    floor_changes = int(np.count_nonzero(frames[2][-5:] != frames[0][-5:]))
    if floor_changes != 0:
        raise SystemExit(f"floor invariant failed: {floor_changes}")
    if np.count_nonzero(mask) < 90000:
        raise SystemExit(f"character mask unexpectedly small: {np.count_nonzero(mask)}")
    print(f"source_sha256={SOURCE_SHA256}")
    print(f"character_mask_pixels={np.count_nonzero(mask)}")
    print(f"boots_floor_changed_pixels={floor_changes}")
    print(f"frames={','.join(FRAME_NAMES)} dimensions=400x600 rgba=true")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    if args.check:
        check()
    else:
        generate()
        print(f"generated {OUT.relative_to(ROOT)}")
