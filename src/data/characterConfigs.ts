import blinkArtwork from "../assets/character-frame-blink.png";
import breatheArtwork from "../assets/character-frame-breathe.png";
import idleArtwork from "../assets/character-frame-idle.png";
import type { EquipmentItem } from "./equipment";
import { validateEquipment } from "./equipment";

export type PortraitFrame = {
  id: "idle" | "breathe" | "blink";
  role: "base" | "blink";
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
  frames: [PortraitFrame, PortraitFrame, PortraitFrame];
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
    // Measured from the normalized 1536px canvases. The CSS offsets lift each
    // frame just enough to keep its soles on the idle frame's baseline.
    { id: "idle", role: "base", artwork: idleArtwork, floorY: 87.5 },
    { id: "breathe", role: "base", artwork: breatheArtwork, floorY: 87.565 },
    { id: "blink", role: "blink", artwork: blinkArtwork, floorY: 87.695 },
  ],
  hotspots: portraitHotspots,
};

export function validateCharacterConfig(config: CharacterConfig): void {
  if (config.width <= 0 || config.height <= 0) throw new Error("Invalid character dimensions");
  if (config.floorY < 0 || config.floorY > 100) throw new Error("Scene floor is outside stage");
  if (config.frames.length < 2) throw new Error("Character must define multiple animation frames");
  if (config.frames.filter(({ role }) => role === "base").length < 2) throw new Error("Character must define multiple base frames");
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
