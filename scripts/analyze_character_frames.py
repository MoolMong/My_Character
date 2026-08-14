#!/usr/bin/env python3
"""Report opaque subject bounds for normalized character PNG frames."""

from __future__ import annotations

import argparse

from remove_portrait_background import read_png


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("frames", nargs="+")
    args = parser.parse_args()

    for path in args.frames:
        width, height, channels, pixels = read_png(path)
        if channels != 4:
            raise ValueError(f"Expected RGBA cutout: {path}")
        opaque = [index for index in range(width * height) if pixels[index * channels + 3]]
        xs = [index % width for index in opaque]
        ys = [index // width for index in opaque]
        print(
            f"{path}: canvas={width}x{height} "
            f"bounds=({min(xs)},{min(ys)})-({max(xs)},{max(ys)}) "
            f"floor={max(ys)} ({max(ys) / height * 100:.3f}%)"
        )


if __name__ == "__main__":
    main()
