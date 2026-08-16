#!/usr/bin/env python3
"""Regenerate the five deterministic idle frames from the verified cutouts.

The neutral frame is an exact copy of portrait A. The other frames use only
nearest-neighbour coordinate remapping of portrait A pixels. Portrait B is
validated as a second approved reference and its sole offset is reported, but
is not blended: its full-body pose change is too large for a stable idle loop.
"""

from __future__ import annotations

import hashlib
from pathlib import Path

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "src" / "assets"
SOURCE_A = ASSETS / "character-portrait-a-cutout.png"
SOURCE_B = ASSETS / "character-portrait-b-cutout.png"
OUTPUTS = ASSETS / "idle-frames"
SIZE = (1024, 1536)
FLOOR_ROW = 1345
LOCKED_FROM_ROW = 1050

# name, breath expansion, hair/ahoge sway, cape-tip sway (source pixels)
POSES = (
    ("neutral", 0, 0, 0),
    ("inhale", 4, 4, 6),
    ("peak", 8, 8, 12),
    ("exhale", 3, 3, 5),
    ("settle", -2, -4, -4),
)


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    bbox = image.getchannel("A").getbbox()
    if bbox is None:
        raise ValueError("Source has no visible pixels")
    return bbox


def tent(values: np.ndarray, start: float, peak_start: float, peak_end: float, end: float) -> np.ndarray:
    """A clipped trapezoid used to localise a nearest-neighbour displacement."""
    rise = np.clip((values - start) / (peak_start - start), 0.0, 1.0)
    fall = np.clip((end - values) / (end - peak_end), 0.0, 1.0)
    return np.minimum(rise, fall)


def remap(source: np.ndarray, breath: int, hair: int, cape: int) -> np.ndarray:
    height, width, _ = source.shape
    yy, xx = np.indices((height, width), dtype=np.float32)
    dx = np.zeros((height, width), dtype=np.float32)
    dy = np.zeros((height, width), dtype=np.float32)

    # Upper-chest expansion is anchored at the centre and fades out before the
    # belt/arms. At peak inhale the shoulder silhouette grows by 8 source px.
    torso_y = tent(yy, 470, 555, 690, 790)
    torso_x = tent(xx, 315, 390, 640, 715)
    side = np.clip((xx - 512.0) / 150.0, -1.0, 1.0)
    dx += breath * side * torso_x * torso_y
    # A tiny local lift in the breastplate reads as breath without translating
    # the head, belt, legs, or whole character.
    chest_x = tent(xx, 390, 430, 595, 635)
    chest_y = tent(yy, 520, 570, 690, 750)
    dy -= round(abs(breath) / 4) * chest_x * chest_y

    # Hair and ahoge sway together, with separate soft bounds so only the
    # approved source pixels are resampled. No generated/inpainted pixels.
    head = tent(xx, 325, 380, 650, 705) * tent(yy, 215, 270, 500, 570)
    ahoge = tent(xx, 440, 465, 545, 570) * tent(yy, 145, 165, 275, 300)
    dx += hair * (0.45 * head + ahoge)

    # Cape tips move more than the torso. The lower fade ends at y=1035, above
    # LOCKED_FROM_ROW, so soles and ground contact remain byte-identical.
    right_cape = tent(xx, 655, 705, 900, 950) * tent(yy, 610, 690, 900, 1035)
    left_cape = tent(xx, 285, 320, 430, 470) * tent(yy, 690, 770, 940, 1035)
    dx += cape * right_cape - (cape * 0.45) * left_cape

    source_x = np.rint(xx - dx).astype(np.int32)
    source_y = np.rint(yy - dy).astype(np.int32)
    np.clip(source_x, 0, width - 1, out=source_x)
    np.clip(source_y, 0, height - 1, out=source_y)
    result = source[source_y, source_x].copy()
    result[LOCKED_FROM_ROW:] = source[LOCKED_FROM_ROW:]
    return result


def main() -> None:
    a = Image.open(SOURCE_A).convert("RGBA")
    b = Image.open(SOURCE_B).convert("RGBA")
    if a.size != SIZE or b.size != SIZE:
        raise ValueError(f"Both verified sources must be {SIZE}; got {a.size} and {b.size}")
    a_bbox, b_bbox = alpha_bbox(a), alpha_bbox(b)
    if a_bbox[3] - 1 != FLOOR_ROW:
        raise ValueError(f"Portrait A floor changed: expected row {FLOOR_ROW}, got {a_bbox[3] - 1}")

    source = np.asarray(a)
    OUTPUTS.mkdir(parents=True, exist_ok=True)
    for index, (name, breath, hair, cape) in enumerate(POSES):
        pixels = source.copy() if index == 0 else remap(source, breath, hair, cape)
        if not np.array_equal(pixels[LOCKED_FROM_ROW:], source[LOCKED_FROM_ROW:]):
            raise AssertionError(f"Locked lower-body pixels moved in {name}")
        frame = Image.fromarray(pixels, "RGBA")
        if frame.size != SIZE or alpha_bbox(frame)[3] - 1 != FLOOR_ROW:
            raise AssertionError(f"Invalid canvas or floor in {name}")
        path = OUTPUTS / f"idle-{index}-{name}.png"
        frame.save(path, format="PNG", optimize=True, compress_level=9)
        digest = hashlib.sha256(path.read_bytes()).hexdigest()[:12]
        changed = int(np.any(pixels != source, axis=2).sum())
        print(f"{path.relative_to(ROOT)} sha256={digest} changed_pixels={changed}")

    print(f"portrait B approved reference floor row={b_bbox[3] - 1}; offset to A={FLOOR_ROW - (b_bbox[3] - 1)}px")


if __name__ == "__main__":
    main()
