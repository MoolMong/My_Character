import { describe, expect, it } from "vitest";
import { characterConfig, validateCharacterConfig } from "./characterConfigs";

describe("character config data", () => {
  it("defines one character with one stable floor-aligned frame", () => {
    expect(() => validateCharacterConfig(characterConfig)).not.toThrow();
    expect(characterConfig.id).toBe("main-character");
    expect(characterConfig.frames.map(({ id }) => id)).toEqual(["idle-a"]);
    expect(characterConfig.frames).toHaveLength(1);
    expect(characterConfig.floorY).toBe(87.5);
    expect(characterConfig.frames.map(({ floorY }) => floorY)).toEqual([87.5]);
    expect(characterConfig.width / characterConfig.height).toBeCloseTo(2 / 3);
  });

  it("uses one bounded four-item map with honest infrastructure copy", () => {
    expect(characterConfig.hotspots.map(({ id }) => id)).toEqual(["spear", "shield", "gloves", "shoes"]);
    expect(characterConfig.hotspots.every(({ description }) => description.length > 0)).toBe(true);
  });
});
