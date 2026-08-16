import neutral from "../assets/board-layers/character-neutral.png";
import inhale from "../assets/board-layers/character-inhale.png";
import peak from "../assets/board-layers/character-peak.png";
import settle from "../assets/board-layers/character-settle.png";
import type { EquipmentItem } from "./equipment";
import { validateEquipment } from "./equipment";

export type CharacterConfig = { id: "main-character"; width: number; height: number; frames: string[]; hotspots: EquipmentItem[] };
const p = (x: number, y: number) => ({ x, y });
const hotspot = (item: Omit<EquipmentItem, "bubbleAnchor">): EquipmentItem => ({ ...item, bubbleAnchor: p(item.tooltipSide === "left" ? 0 : 100, 50) });

const hotspots: EquipmentItem[] = [
  hotspot({ id: "spear", title: "컨테이너 수호창", technology: "Kubernetes / Container", description: "컨테이너 기반 서비스의 운영과 배포를 다룹니다.", hitbox: { x: 5, y: 2, width: 15, height: 91 }, itemAnchor: p(14, 32), tooltipSide: "left", outline: [p(11,2),p(17,8),p(15,25),p(17,70),p(13,94),p(9,70),p(11,25),p(7,8)] }),
  hotspot({ id: "armor", title: "프라이빗 철갑", technology: "OpenStack", description: "OpenStack 기반 프라이빗 클라우드 환경을 운영해왔습니다.", hitbox: { x: 38, y: 38, width: 23, height: 17 }, itemAnchor: p(50, 45), tooltipSide: "right", outline: [p(38,38),p(48,35),p(60,39),p(62,50),p(55,57),p(42,55),p(36,48)] }),
  hotspot({ id: "shield", title: "구름 기사의 방패", technology: "AWS", description: "퍼블릭 클라우드 환경을 익히고 확장하고 있습니다.", hitbox: { x: 65, y: 38, width: 24, height: 31 }, itemAnchor: p(77, 53), tooltipSide: "right", outline: [p(69,38),p(86,42),p(89,50),p(86,64),p(77,70),p(68,64),p(65,50)] }),
  hotspot({ id: "gloves", title: "닳고닳은 파이썬 장갑", technology: "Python", description: "반복되는 운영 작업을 Python으로 자동화합니다.", hitbox: { x: 22, y: 40, width: 15, height: 17 }, itemAnchor: p(29, 48), tooltipSide: "left", outline: [p(25,40),p(34,41),p(38,48),p(34,56),p(25,57),p(20,50)] }),
  hotspot({ id: "cape", title: "설계자의 망토", technology: "Terraform / IaC", description: "인프라를 코드로 정의하고 표준화하는 방식을 익히고 있습니다.", hitbox: { x: 61, y: 56, width: 15, height: 25 }, itemAnchor: p(69, 68), tooltipSide: "right", outline: [p(63,53),p(73,58),p(78,70),p(72,82),p(61,78),p(65,68)] }),
  hotspot({ id: "shoes", title: "리눅스 여행 부츠", technology: "Linux", description: "서버와 인프라를 다루는 가장 오래된 기본기입니다.", hitbox: { x: 37, y: 78, width: 28, height: 18 }, itemAnchor: p(51, 88), tooltipSide: "left", outline: [p(38,80),p(49,79),p(51,88),p(55,79),p(64,81),p(67,93),p(55,96),p(50,92),p(45,96),p(34,93)] }),
];

export const characterConfig: CharacterConfig = { id: "main-character", width: 400, height: 600, frames: [neutral, inhale, peak, settle], hotspots };
export function validateCharacterConfig(config: CharacterConfig): void {
  if (config.width !== 400 || config.height !== 600 || config.frames.length !== 4 || config.frames.some((frame) => !frame)) throw new Error("Invalid character frames");
  validateEquipment(config.hotspots);
  if (config.hotspots.map(({ id }) => id).join(",") !== "spear,armor,shield,gloves,cape,shoes") throw new Error("Character must define all six equipment hotspots");
}
if (import.meta.env.DEV) validateCharacterConfig(characterConfig);
