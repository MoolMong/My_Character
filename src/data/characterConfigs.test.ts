import { describe, expect, it } from "vitest";
import { characterConfig, validateCharacterConfig } from "./characterConfigs";

describe("character config data", () => {
  it("defines four tight runtime frames without importing the source board", () => {
    expect(() => validateCharacterConfig(characterConfig)).not.toThrow();
    expect(characterConfig.id).toBe("main-character");
    expect(characterConfig.width).toBeLessThan(600);
    expect(characterConfig.height).toBeLessThan(800);
    expect(characterConfig.frames).toHaveLength(4);
    expect(characterConfig.frames.every((frame) => frame.includes("board-layers/character-"))).toBe(true);
    expect(JSON.stringify(characterConfig)).not.toContain("character-board-v2.png");
  });

  it("maps all six worn or held items with anchors and recognizable outline geometry", () => {
    expect(characterConfig.hotspots.map(({ id }) => id)).toEqual(["spear", "armor", "shield", "gloves", "cape", "shoes"]);
    expect(characterConfig.hotspots.every(({ outline }) => outline.length >= 4)).toBe(true);
    expect(characterConfig.hotspots.every(({ description }) => description.length > 0)).toBe(true);
  });

  it("terminates every side connector at the stage edge", () => {
    expect(characterConfig.hotspots.every(({ bubbleAnchor, tooltipSide }) =>
      bubbleAnchor.x === (tooltipSide === "left" ? 0 : 100)
    )).toBe(true);
  });
});
