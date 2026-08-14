import portraitAArtwork from "../assets/character-portrait-a.png";
import type { EquipmentItem } from "./equipment";
import { validateEquipment } from "./equipment";

export type PortraitFrame = {
  id: "idle-a";
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
  frames: [PortraitFrame];
  hotspots: EquipmentItem[];
};

// Portfolio copy is intentionally limited to the neutral descriptions already
// approved for the original equipment board. No career claims live here.
const portraitCopy = {
  spear: {
    title: "컨테이너 수호창",
    technology: "Kubernetes / Container",
    description: "컨테이너 기반 서비스의 운영과 배포를 다룹니다.",
  },
  shield: {
    title: "구름 기사의 방패",
    technology: "AWS",
    description: "퍼블릭 클라우드 환경을 익히고 확장하고 있습니다.",
  },
  gloves: {
    title: "닳고닳은 파이썬 장갑",
    technology: "Python",
    description: "반복되는 운영 작업을 Python으로 자동화합니다.",
  },
  shoes: {
    title: "리눅스 여행 부츠",
    technology: "Linux",
    description: "서버와 인프라를 다루는 가장 오래된 기본기입니다.",
  },
} as const;

// Calibrated against portrait A, the only runtime frame. The second source file
// is retained as a reference asset but is deliberately not imported: swapping
// full-frame raster poses produced visible double edges and floor instability.
const portraitHotspots: EquipmentItem[] = [
  { id: "spear", ...portraitCopy.spear, hitbox: { x: 68, y: 56, width: 27, height: 25 }, anchor: { x: 80, y: 66 }, tooltipSide: "right" },
  { id: "shield", ...portraitCopy.shield, hitbox: { x: 10, y: 46, width: 27, height: 29 }, anchor: { x: 24, y: 59 }, tooltipSide: "left" },
  { id: "gloves", ...portraitCopy.gloves, hitbox: { x: 61.5, y: 42, width: 11.5, height: 14 }, anchor: { x: 67, y: 50 }, tooltipSide: "right" },
  { id: "shoes", ...portraitCopy.shoes, hitbox: { x: 32, y: 70, width: 37, height: 18 }, anchor: { x: 51, y: 81 }, tooltipSide: "left" },
];

export const characterConfig: CharacterConfig = {
  id: "main-character",
  width: 1024,
  height: 1536,
  floorY: 87.5,
  frames: [
    { id: "idle-a", artwork: portraitAArtwork, floorY: 87.5 },
  ],
  hotspots: portraitHotspots,
};

export function validateCharacterConfig(config: CharacterConfig): void {
  if (config.width <= 0 || config.height <= 0) throw new Error("Invalid character dimensions");
  if (config.floorY < 0 || config.floorY > 100) throw new Error("Scene floor is outside stage");
  if (config.frames.length !== 1) throw new Error("Character must define one stable frame");
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
