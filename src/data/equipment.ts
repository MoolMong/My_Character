export type PercentageRect = { x: number; y: number; width: number; height: number };
export type PercentagePoint = { x: number; y: number };

export type EquipmentItem = {
  id: string;
  title: string;
  technology: string;
  description: string;
  hitbox: PercentageRect;
  anchor: PercentagePoint;
  tooltipSide: "left" | "right";
};

// Provisional coordinates for the CSS character. Recalibrate these values only when art changes.
export const equipment: EquipmentItem[] = [
  { id: "container-spear", title: "컨테이너 수호창", technology: "Kubernetes / Container", description: "컨테이너 기반 서비스의 운영과 배포를 다룹니다.", hitbox: { x: 11, y: 18, width: 15, height: 55 }, anchor: { x: 19, y: 35 }, tooltipSide: "left" },
  { id: "architect-cloak", title: "설계자의 망토", technology: "Terraform / IaC", description: "인프라를 코드로 정의하고 표준화하는 방식을 익히고 있습니다.", hitbox: { x: 42, y: 29, width: 27, height: 38 }, anchor: { x: 61, y: 43 }, tooltipSide: "right" },
  { id: "private-armor", title: "프라이빗 철갑", technology: "OpenStack", description: "OpenStack 기반 프라이빗 클라우드 환경을 운영해왔습니다.", hitbox: { x: 38, y: 34, width: 24, height: 22 }, anchor: { x: 51, y: 44 }, tooltipSide: "right" },
  { id: "python-bracer", title: "닳고닳은 파이썬 손목보호대", technology: "Python", description: "반복되는 운영 작업을 Python으로 자동화합니다.", hitbox: { x: 29, y: 43, width: 12, height: 17 }, anchor: { x: 35, y: 51 }, tooltipSide: "left" },
  { id: "cloud-shield", title: "구름 기사의 방패", technology: "AWS", description: "퍼블릭 클라우드 환경을 익히고 확장하고 있습니다.", hitbox: { x: 62, y: 40, width: 25, height: 27 }, anchor: { x: 75, y: 52 }, tooltipSide: "right" },
  { id: "linux-boots", title: "리눅스 여행 부츠", technology: "Linux", description: "서버와 인프라를 다루는 가장 오래된 기본기입니다.", hitbox: { x: 39, y: 72, width: 25, height: 18 }, anchor: { x: 51, y: 80 }, tooltipSide: "left" },
];

export function validateEquipment(items: EquipmentItem[]): void {
  const ids = new Set<string>();
  for (const item of items) {
    if (ids.has(item.id)) throw new Error(`Duplicate equipment id: ${item.id}`);
    ids.add(item.id);
    const { x, y, width, height } = item.hitbox;
    const values = [x, y, width, height, item.anchor.x, item.anchor.y];
    if (values.some((value) => !Number.isFinite(value))) throw new Error(`Non-finite coordinate: ${item.id}`);
    if (x < 0 || y < 0 || width <= 0 || height <= 0 || x + width > 100 || y + height > 100 || item.anchor.x < 0 || item.anchor.x > 100 || item.anchor.y < 0 || item.anchor.y > 100) {
      throw new Error(`Coordinate outside stage: ${item.id}`);
    }
  }
}

if (import.meta.env.DEV) validateEquipment(equipment);
