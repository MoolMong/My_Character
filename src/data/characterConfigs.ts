import boardArtwork from "../assets/character-v1.png";
import portraitAArtwork from "../assets/character-portrait-a.png";
import portraitBArtwork from "../assets/character-portrait-b.png";
import { equipment, type EquipmentItem, validateEquipment } from "./equipment";

export type CharacterConfigId = "equipment-board" | "portrait-a" | "portrait-b";

export type CharacterConfig = {
  id: CharacterConfigId;
  label: string;
  artwork: string;
  width: number;
  height: number;
  portrait: boolean;
  equipment: EquipmentItem[];
};

// Editable placeholder copy for both portrait configurations. Replace only these
// strings when approved glove and shoe descriptions are available.
const portraitCopy = {
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

const portraitAEquipment: EquipmentItem[] = [
  { id: "gloves", ...portraitCopy.gloves, hitbox: { x: 62.5, y: 43.5, width: 9.5, height: 15 }, anchor: { x: 67, y: 51 }, tooltipSide: "right" },
  { id: "shoes", ...portraitCopy.shoes, hitbox: { x: 32.5, y: 71.5, width: 36, height: 16 }, anchor: { x: 51, y: 81 }, tooltipSide: "left" },
];

const portraitBEquipment: EquipmentItem[] = [
  { id: "gloves", ...portraitCopy.gloves, hitbox: { x: 62, y: 41.5, width: 10, height: 15.5 }, anchor: { x: 67, y: 49 }, tooltipSide: "right" },
  { id: "shoes", ...portraitCopy.shoes, hitbox: { x: 32.5, y: 69.5, width: 36, height: 16 }, anchor: { x: 51, y: 79 }, tooltipSide: "left" },
];

export const characterConfigs: CharacterConfig[] = [
  { id: "equipment-board", label: "장비 보드", artwork: boardArtwork, width: 1122, height: 1402, portrait: false, equipment },
  { id: "portrait-a", label: "캐릭터 A", artwork: portraitAArtwork, width: 1024, height: 1536, portrait: true, equipment: portraitAEquipment },
  { id: "portrait-b", label: "캐릭터 B", artwork: portraitBArtwork, width: 1024, height: 1536, portrait: true, equipment: portraitBEquipment },
];

export function validateCharacterConfigs(configs: CharacterConfig[]): void {
  const ids = new Set<string>();
  for (const config of configs) {
    if (ids.has(config.id)) throw new Error(`Duplicate character config id: ${config.id}`);
    ids.add(config.id);
    if (config.width <= 0 || config.height <= 0) throw new Error(`Invalid dimensions: ${config.id}`);
    validateEquipment(config.equipment);
    if (config.portrait && config.equipment.map(({ id }) => id).join(",") !== "gloves,shoes") {
      throw new Error(`Portrait config must define gloves and shoes: ${config.id}`);
    }
  }
}

if (import.meta.env.DEV) validateCharacterConfigs(characterConfigs);
