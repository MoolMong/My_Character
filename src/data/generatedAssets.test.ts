import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

describe("layered board generator", () => {
  it("passes deterministic asset and composite invariants", () => {
    const result = spawnSync("uv", ["run", "--with", "pillow", "--with", "numpy", "--with", "opencv-python-headless", "python", "scripts/generate_board_layers.py", "--check"], {
      cwd: process.cwd(),
      encoding: "utf8",
    });
    expect(result.status, `${result.stdout}\n${result.stderr}`).toBe(0);
    expect(result.stdout).toContain("source_sha256=63899dff4cc6fbd5e6858db0d230431ed700ac8bb0d1c8159931b79a670fc326");
    expect(result.stdout).toContain("dimensions=400x600 rgba=true");
    expect(result.stdout).toContain("boots_floor_changed_pixels=0");
  }, 20_000);
});
