import { describe, expect, it } from "vitest";
import { characterConfig, validateCharacterConfig } from "./characterConfigs";

describe("character config data", () => {
  it("defines one static board at the supplied source dimensions", () => {
    expect(() => validateCharacterConfig(characterConfig)).not.toThrow();
    expect(characterConfig.id).toBe("main-character");
    expect(characterConfig.width).toBe(1122);
    expect(characterConfig.height).toBe(1402);
    expect(characterConfig.width / characterConfig.height).toBeCloseTo(1122 / 1402);
    expect(characterConfig.artwork).toContain("character-board-v2.png");
  });

  it("uses one bounded four-item map with honest infrastructure copy", () => {
    expect(characterConfig.hotspots.map(({ id }) => id)).toEqual(["spear", "shield", "gloves", "shoes"]);
    expect(characterConfig.hotspots.every(({ description }) => description.length > 0)).toBe(true);
  });
});
