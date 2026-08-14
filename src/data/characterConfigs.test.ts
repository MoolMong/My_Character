import { describe, expect, it } from "vitest";
import { characterConfigs, validateCharacterConfigs } from "./characterConfigs";

describe("character config data", () => {
  it("defines one board and two independently mapped portrait configs", () => {
    expect(() => validateCharacterConfigs(characterConfigs)).not.toThrow();
    expect(characterConfigs.map(({ id }) => id)).toEqual(["equipment-board", "portrait-a", "portrait-b"]);

    const portraits = characterConfigs.filter(({ portrait }) => portrait);
    expect(portraits).toHaveLength(2);
    expect(portraits.every(({ width, height }) => width === 1024 && height === 1536)).toBe(true);
    expect(portraits[0].equipment).not.toBe(portraits[1].equipment);
    expect(portraits[0].equipment.map(({ hitbox }) => hitbox)).not.toEqual(portraits[1].equipment.map(({ hitbox }) => hitbox));
  });

  it("gives every portrait bounded glove and shoe coordinates and placeholder copy", () => {
    for (const config of characterConfigs.filter(({ portrait }) => portrait)) {
      expect(config.equipment.map(({ id }) => id)).toEqual(["gloves", "shoes"]);
      expect(config.equipment.every(({ description }) => description === "설명 준비 중 — 이 문구를 교체하세요.")).toBe(true);
    }
  });
});
