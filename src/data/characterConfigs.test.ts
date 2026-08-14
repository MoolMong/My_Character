import { describe, expect, it } from "vitest";
import { characterConfig, validateCharacterConfig } from "./characterConfigs";

describe("character config data", () => {
  it("defines one character with one immutable visual master", () => {
    expect(() => validateCharacterConfig(characterConfig)).not.toThrow();
    expect(characterConfig.id).toBe("main-character");
    expect(characterConfig.baseArtwork).toContain("character-frame-idle");
    expect(characterConfig.floorY).toBe(87.5);
    expect(characterConfig.width / characterConfig.height).toBeCloseTo(2 / 3);
  });

  it("uses one bounded four-equipment map with editable placeholder copy", () => {
    expect(characterConfig.hotspots.map(({ id }) => id)).toEqual(["spear", "shield", "gloves", "shoes"]);
    expect(characterConfig.hotspots.every(({ description }) => description === "설명 준비 중 — 이 문구를 교체하세요.")).toBe(true);
  });
});
