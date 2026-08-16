import boardArtwork from "../assets/character-board-v2.png";
import type { EquipmentItem } from "./equipment";
import { validateEquipment } from "./equipment";

export type CharacterConfig = {
  id: "main-character";
  width: number;
  height: number;
  artwork: string;
  hotspots: EquipmentItem[];
};

// Interaction copy stays independent from the composed artwork. The percentage
// rectangles are calibrated to the baked equipment cards in character-board-v2.
const boardHotspots: EquipmentItem[] = [
  { id: "spear", title: "컨테이너 수호창", technology: "Kubernetes / Container", description: "컨테이너 기반 서비스의 운영과 배포를 다룹니다.", hitbox: { x: 3.2, y: 20.6, width: 26.3, height: 14.5 }, anchor: { x: 16.4, y: 27.9 }, tooltipSide: "left" },
  { id: "shield", title: "구름 기사의 방패", technology: "AWS", description: "퍼블릭 클라우드 환경을 익히고 확장하고 있습니다.", hitbox: { x: 68.2, y: 36.6, width: 27, height: 14.3 }, anchor: { x: 81.7, y: 43.8 }, tooltipSide: "right" },
  { id: "gloves", title: "닳고닳은 파이썬 장갑", technology: "Python", description: "반복되는 운영 작업을 Python으로 자동화합니다.", hitbox: { x: 3.2, y: 36.4, width: 26.3, height: 14.4 }, anchor: { x: 16.4, y: 43.6 }, tooltipSide: "left" },
  { id: "shoes", title: "리눅스 여행 부츠", technology: "Linux", description: "서버와 인프라를 다루는 가장 오래된 기본기입니다.", hitbox: { x: 3.2, y: 52, width: 26.3, height: 12.4 }, anchor: { x: 16.4, y: 58.2 }, tooltipSide: "left" },
];

export const characterConfig: CharacterConfig = {
  id: "main-character",
  width: 1122,
  height: 1402,
  artwork: boardArtwork,
  hotspots: boardHotspots,
};

export function validateCharacterConfig(config: CharacterConfig): void {
  if (config.width !== 1122 || config.height !== 1402) throw new Error("Unexpected board dimensions");
  if (!config.artwork) throw new Error("Missing board artwork");
  validateEquipment(config.hotspots);
  if (config.hotspots.map(({ id }) => id).join(",") !== "spear,shield,gloves,shoes") {
    throw new Error("Character must define spear, shield, glove, and shoe hotspots");
  }
}

if (import.meta.env.DEV) validateCharacterConfig(characterConfig);
