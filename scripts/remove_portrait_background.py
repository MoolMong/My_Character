#!/usr/bin/env python3
"""Remove a light, low-chroma background connected to a PNG canvas edge.

This intentionally uses only the Python standard library. It supports the
8-bit, non-interlaced RGB/RGBA PNGs used by this project and preserves RGB
values while setting matched background pixels transparent.
"""

from __future__ import annotations

import argparse
from collections import deque
import struct
import zlib


PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"


def paeth(left: int, above: int, upper_left: int) -> int:
    prediction = left + above - upper_left
    distances = (abs(prediction - left), abs(prediction - above), abs(prediction - upper_left))
    return (left, above, upper_left)[distances.index(min(distances))]


def read_png(path: str) -> tuple[int, int, int, bytearray]:
    with open(path, "rb") as source:
        data = source.read()
    if not data.startswith(PNG_SIGNATURE):
        raise ValueError(f"Not a PNG: {path}")

    cursor = len(PNG_SIGNATURE)
    compressed = bytearray()
    width = height = channels = 0
    while cursor < len(data):
        length = struct.unpack(">I", data[cursor : cursor + 4])[0]
        kind = data[cursor + 4 : cursor + 8]
        payload = data[cursor + 8 : cursor + 8 + length]
        cursor += length + 12
        if kind == b"IHDR":
            width, height, depth, color_type, compression, filtering, interlace = struct.unpack(">IIBBBBB", payload)
            if depth != 8 or color_type not in (2, 6) or compression or filtering or interlace:
                raise ValueError("Expected an 8-bit, non-interlaced RGB or RGBA PNG")
            channels = 3 if color_type == 2 else 4
        elif kind == b"IDAT":
            compressed.extend(payload)
        elif kind == b"IEND":
            break

    raw = zlib.decompress(compressed)
    stride = width * channels
    pixels = bytearray(height * stride)
    previous = bytearray(stride)
    offset = 0
    for y in range(height):
        filter_type = raw[offset]
        offset += 1
        encoded = raw[offset : offset + stride]
        offset += stride
        row = bytearray(stride)
        for x, value in enumerate(encoded):
            left = row[x - channels] if x >= channels else 0
            above = previous[x]
            upper_left = previous[x - channels] if x >= channels else 0
            predictors = (0, left, above, (left + above) // 2, paeth(left, above, upper_left))
            if filter_type > 4:
                raise ValueError(f"Unsupported PNG filter {filter_type}")
            row[x] = (value + predictors[filter_type]) & 255
        pixels[y * stride : (y + 1) * stride] = row
        previous = row
    return width, height, channels, pixels


def chunk(kind: bytes, payload: bytes) -> bytes:
    body = kind + payload
    return struct.pack(">I", len(payload)) + body + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)


def write_rgba_png(path: str, width: int, height: int, pixels: bytearray) -> None:
    stride = width * 4
    raw = b"".join(b"\x00" + pixels[y * stride : (y + 1) * stride] for y in range(height))
    header = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)
    with open(path, "wb") as target:
        target.write(PNG_SIGNATURE)
        target.write(chunk(b"IHDR", header))
        target.write(chunk(b"IDAT", zlib.compress(raw, 9)))
        target.write(chunk(b"IEND", b""))


def remove_background(input_path: str, output_path: str, lightness: int, chroma: int) -> tuple[int, int, int]:
    width, height, channels, source = read_png(input_path)
    rgba = bytearray(width * height * 4)
    candidates = bytearray(width * height)
    for index in range(width * height):
        source_offset = index * channels
        target_offset = index * 4
        red, green, blue = source[source_offset : source_offset + 3]
        rgba[target_offset : target_offset + 4] = bytes((red, green, blue, source[source_offset + 3] if channels == 4 else 255))
        candidates[index] = min(red, green, blue) >= lightness and max(red, green, blue) - min(red, green, blue) <= chroma

    queue: deque[int] = deque()
    background = bytearray(width * height)
    for x in range(width):
        queue.extend((x, (height - 1) * width + x))
    for y in range(1, height - 1):
        queue.extend((y * width, y * width + width - 1))

    removed = 0
    while queue:
        index = queue.popleft()
        if background[index] or not candidates[index]:
            continue
        background[index] = 1
        rgba[index * 4 + 3] = 0
        removed += 1
        x, y = index % width, index // width
        if x: queue.append(index - 1)
        if x + 1 < width: queue.append(index + 1)
        if y: queue.append(index - width)
        if y + 1 < height: queue.append(index + width)

    write_rgba_png(output_path, width, height, rgba)
    return width, height, removed


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input")
    parser.add_argument("output")
    parser.add_argument("--lightness", type=int, default=180, help="minimum RGB channel for background candidates")
    parser.add_argument("--chroma", type=int, default=55, help="maximum difference between RGB channels")
    args = parser.parse_args()
    width, height, removed = remove_background(args.input, args.output, args.lightness, args.chroma)
    print(f"{args.output}: {width}x{height}, {removed} transparent pixels ({removed / (width * height):.1%})")


if __name__ == "__main__":
    main()
