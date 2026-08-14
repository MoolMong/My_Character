import portraitAArtwork from "../assets/character-portrait-a-cutout.png";
import portraitBArtwork from "../assets/character-portrait-b-cutout.png";
import type { EquipmentItem } from "./equipment";
import { validateEquipment } from "./equipment";

export type PortraitFrame = {
  id: "idle-a" | "idle-b";
  artwork: string;
  /** Percentage y-coordinate where the soles meet the floor in this source image. */
  floorY: number;
};

export type CharacterConfig = {
  id: "main-character";
  width: number;
  height: number;
  /** Shared scene baseline. Frame offsets are calculated against this value. */
  floorY: number;
  frames: [PortraitFrame, PortraitFrame];
  hotspots: EquipmentItem[];
};

// Editable placeholder copy. Replace only these strings when approved
// equipment descriptions are available.
const portraitCopy = {
  spear: {
    title: "창",
    technology: "편집 가능한 임시 문구",
    description: "설명 준비 중 — 이 문구를 교체하세요.",
  },
  shield: {
    title: "방패",
    technology: "편집 가능한 임시 문구",
    description: "설명 준비 중 — 이 문구를 교체하세요.",
  },
  gloves: {
    title: "장갑",
    technology: "편집 가능한 임시 문구",
    description: "설명 준비 중 — 이 문구를 교체하세요.",
  },
  shoes: {
    title: "신발",
    technology: "편집 가능한 임시 문구",
    description: "설명 준비 중 — 이 문구를 교체하세요.",
  },
} as const;

// One shared map intentionally covers the small pose differences in both idle
// frames. Keep these bounds close to the visible equipment.
const portraitHotspots: EquipmentItem[] = [
  { id: "spear", ...portraitCopy.spear, hitbox: { x: 66, y: 51, width: 29, height: 30 }, anchor: { x: 79, y: 65 }, tooltipSide: "right" },
  { id: "shield", ...portraitCopy.shield, hitbox: { x: 11.5, y: 44, width: 26, height: 30 }, anchor: { x: 23.5, y: 58 }, tooltipSide: "left" },
  { id: "gloves", ...portraitCopy.gloves, hitbox: { x: 62, y: 42, width: 10.5, height: 16.5 }, anchor: { x: 67, y: 50.5 }, tooltipSide: "right" },
  { id: "shoes", ...portraitCopy.shoes, hitbox: { x: 32.5, y: 70, width: 36, height: 17.5 }, anchor: { x: 51, y: 80 }, tooltipSide: "left" },
];

export const characterConfig: CharacterConfig = {
  id: "main-character",
  width: 1024,
  height: 1536,
  floorY: 87.5,
  frames: [
    // Measured from the 1536px source canvases: A soles end at y=1344,
    // while B ends at y=1310. Per-frame offsets keep both on A's baseline.
    { id: "idle-a", artwork: portraitAArtwork, floorY: 87.5 },
    { id: "idle-b", artwork: portraitBArtwork, floorY: 85.286 },
  ],
  hotspots: portraitHotspots,
};

export function validateCharacterConfig(config: CharacterConfig): void {
  if (config.width <= 0 || config.height <= 0) throw new Error("Invalid character dimensions");
  if (config.floorY < 0 || config.floorY > 100) throw new Error("Scene floor is outside stage");
  if (config.frames.length !== 2) throw new Error("Character must define two idle frames");
  if (new Set(config.frames.map(({ id }) => id)).size !== config.frames.length) throw new Error("Duplicate portrait frame id");
  for (const frame of config.frames) {
    if (frame.floorY < 0 || frame.floorY > 100) throw new Error(`Frame floor is outside stage: ${frame.id}`);
  }
  validateEquipment(config.hotspots);
  if (config.hotspots.map(({ id }) => id).join(",") !== "spear,shield,gloves,shoes") {
    throw new Error("Character must define spear, shield, glove, and shoe hotspots");
  }
}

if (import.meta.env.DEV) validateCharacterConfig(characterConfig);
