import { describe, expect, it } from "vitest";
import { equipment, validateEquipment } from "./equipment";

describe("equipment data", () => {
  it("contains six valid unique equipment definitions", () => {
    expect(() => validateEquipment(equipment)).not.toThrow();
    expect(equipment).toHaveLength(6);
    expect(new Set(equipment.map(({ id }) => id)).size).toBe(6);
  });

  it("validates both connector endpoints", () => {
    expect(() => validateEquipment([{ ...equipment[0], bubbleAnchor: { x: 101, y: 20 } }])).toThrow(/outside stage/);
  });

  it("rejects coordinates beyond the stage", () => {
    expect(() => validateEquipment([{ ...equipment[0], hitbox: { ...equipment[0].hitbox, x: 99 } }])).toThrow(/outside stage/);
  });
});
