import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const sha256 = (data: Buffer) => createHash("sha256").update(data).digest("hex");
const root = process.cwd();

const expectedFrames: Record<string, string> = {
  "character-neutral.png": "d2d98df4af61db74a5875917c581c6f68e280b4dc53f5253c0807e2c82ede06c",
  "character-inhale.png": "68ca528e58965567dee91b53ae387794944ac6e46a63a273e254d5cc91f77650",
  "character-peak.png": "fe2c73bce5f9076c9a6b9401e38e9d8846406cc8379745aaf9cb53da4efe5e61",
  "character-settle.png": "fa019367f5c2c630b2e0fe15827849459b550c31990535b289a522eb032b0f8e",
};

describe("generated character assets", () => {
  it("locks the verified source and four tight RGBA frames", () => {
    const source = readFileSync(join(root, "src/assets/character-board-v2.png"));
    expect(sha256(source)).toBe("63899dff4cc6fbd5e6858db0d230431ed700ac8bb0d1c8159931b79a670fc326");

    const hashes = Object.entries(expectedFrames).map(([name, expectedHash]) => {
      const png = readFileSync(join(root, "src/assets/board-layers", name));
      expect(png.subarray(1, 4).toString("ascii")).toBe("PNG");
      expect(png.readUInt32BE(16)).toBe(400);
      expect(png.readUInt32BE(20)).toBe(600);
      expect(png[25]).toBe(6);
      const hash = sha256(png);
      expect(hash).toBe(expectedHash);
      return hash;
    });

    expect(new Set(hashes).size).toBe(4);
  });
});
