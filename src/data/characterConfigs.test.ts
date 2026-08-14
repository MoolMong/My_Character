import { describe, expect, it } from "vitest";
import { characterConfig, validateCharacterConfig } from "./characterConfigs";

describe("character config data", () => {
  it("defines one character with floor-aligned base and blink frames", () => {
    expect(() => validateCharacterConfig(characterConfig)).not.toThrow();
    expect(characterConfig.id).toBe("main-character");
    expect(characterConfig.frames.map(({ id }) => id)).toEqual(["idle", "breathe", "blink"]);
    expect(characterConfig.frames).toHaveLength(3);
    expect(characterConfig.floorY).toBe(87.5);
    expect(characterConfig.frames.map(({ floorY }) => floorY)).toEqual([87.5, 87.565, 87.695]);
    expect(characterConfig.frames.map(({ role }) => role)).toEqual(["base", "base", "blink"]);
    expect(characterConfig.width / characterConfig.height).toBeCloseTo(2 / 3);
  });

  it("uses one bounded four-equipment map with editable placeholder copy", () => {
    expect(characterConfig.hotspots.map(({ id }) => id)).toEqual(["spear", "shield", "gloves", "shoes"]);
    expect(characterConfig.hotspots.every(({ description }) => description === "설명 준비 중 — 이 문구를 교체하세요.")).toBe(true);
  });
});
