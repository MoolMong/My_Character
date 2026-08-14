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

// Percentages are calibrated to the labelled panels in character-v1.png.
export const equipment: EquipmentItem[] = [
  { id: "container-spear", title: "컨테이너 수호창", technology: "Kubernetes / Container", description: "컨테이너 기반 서비스의 운영과 배포를 다룹니다.", hitbox: { x: 3.2, y: 20.6, width: 26.3, height: 14.5 }, anchor: { x: 29.5, y: 30.3 }, tooltipSide: "left" },
  { id: "python-bracer", title: "닳고닳은 파이썬 손목보호대", technology: "Python", description: "반복되는 운영 작업을 Python으로 자동화합니다.", hitbox: { x: 3.2, y: 36.4, width: 26.3, height: 14.4 }, anchor: { x: 29.5, y: 43.7 }, tooltipSide: "left" },
  { id: "linux-boots", title: "리눅스 여행 부츠", technology: "Linux", description: "서버와 인프라를 다루는 가장 오래된 기본기입니다.", hitbox: { x: 3.2, y: 52, width: 26.3, height: 12.4 }, anchor: { x: 29.5, y: 59.5 }, tooltipSide: "left" },
  { id: "private-armor", title: "프라이빗 철갑", technology: "OpenStack", description: "OpenStack 기반 프라이빗 클라우드 환경을 운영해왔습니다.", hitbox: { x: 68.2, y: 21.4, width: 27, height: 14 }, anchor: { x: 68.2, y: 28.8 }, tooltipSide: "right" },
  { id: "cloud-shield", title: "구름 기사의 방패", technology: "AWS", description: "퍼블릭 클라우드 환경을 익히고 확장하고 있습니다.", hitbox: { x: 68.2, y: 36.6, width: 27, height: 14.3 }, anchor: { x: 68.2, y: 45.5 }, tooltipSide: "right" },
  { id: "architect-cloak", title: "설계자의 망토", technology: "Terraform / IaC", description: "인프라를 코드로 정의하고 표준화하는 방식을 익히고 있습니다.", hitbox: { x: 68.2, y: 52.1, width: 27, height: 12.4 }, anchor: { x: 68.2, y: 59.2 }, tooltipSide: "right" },
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
