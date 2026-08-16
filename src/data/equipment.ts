export type PercentageRect = { x: number; y: number; width: number; height: number };
export type PercentagePoint = { x: number; y: number };

export type EquipmentItem = {
  id: string;
  title: string;
  technology: string;
  description: string;
  hitbox: PercentageRect;
  itemAnchor: PercentagePoint;
  bubbleAnchor: PercentagePoint;
  tooltipSide: "left" | "right";
  outline: PercentagePoint[];
};

// Percentages are calibrated to the labelled panels in character-v1.png.
const legacyEquipment: Omit<EquipmentItem, "outline">[] = [
  { id: "container-spear", title: "컨테이너 수호창", technology: "Kubernetes / Container", description: "컨테이너 기반 서비스의 운영과 배포를 다룹니다.", hitbox: { x: 34, y: 20, width: 5, height: 41 }, itemAnchor: { x: 36.5, y: 31 }, bubbleAnchor: { x: 4, y: 31 }, tooltipSide: "left" },
  { id: "python-bracer", title: "닳고닳은 파이썬 손목보호대", technology: "Python", description: "반복되는 운영 작업을 Python으로 자동화합니다.", hitbox: { x: 35, y: 39, width: 8, height: 8 }, itemAnchor: { x: 39, y: 43 }, bubbleAnchor: { x: 4, y: 43 }, tooltipSide: "left" },
  { id: "linux-boots", title: "리눅스 여행 부츠", technology: "Linux", description: "서버와 인프라를 다루는 가장 오래된 기본기입니다.", hitbox: { x: 41, y: 52, width: 18, height: 11 }, itemAnchor: { x: 50, y: 58 }, bubbleAnchor: { x: 4, y: 58 }, tooltipSide: "left" },
  { id: "private-armor", title: "프라이빗 철갑", technology: "OpenStack", description: "OpenStack 기반 프라이빗 클라우드 환경을 운영해왔습니다.", hitbox: { x: 43, y: 36, width: 15, height: 10 }, itemAnchor: { x: 52, y: 40 }, bubbleAnchor: { x: 96, y: 40 }, tooltipSide: "right" },
  { id: "cloud-shield", title: "구름 기사의 방패", technology: "AWS", description: "퍼블릭 클라우드 환경을 익히고 확장하고 있습니다.", hitbox: { x: 57, y: 39, width: 10, height: 16 }, itemAnchor: { x: 62, y: 46 }, bubbleAnchor: { x: 96, y: 46 }, tooltipSide: "right" },
  { id: "architect-cloak", title: "설계자의 망토", technology: "Terraform / IaC", description: "인프라를 코드로 정의하고 표준화하는 방식을 익히고 있습니다.", hitbox: { x: 61, y: 52, width: 7, height: 7 }, itemAnchor: { x: 64, y: 55 }, bubbleAnchor: { x: 96, y: 55 }, tooltipSide: "right" },
];
export const equipment: EquipmentItem[] = legacyEquipment.map((item) => ({
  ...item,
  outline: [
    { x: item.hitbox.x, y: item.hitbox.y },
    { x: item.hitbox.x + item.hitbox.width, y: item.hitbox.y },
    { x: item.hitbox.x + item.hitbox.width, y: item.hitbox.y + item.hitbox.height },
    { x: item.hitbox.x, y: item.hitbox.y + item.hitbox.height },
  ],
}));

export function validateEquipment(items: EquipmentItem[]): void {
  const ids = new Set<string>();
  for (const item of items) {
    if (ids.has(item.id)) throw new Error(`Duplicate equipment id: ${item.id}`);
    ids.add(item.id);
    const { x, y, width, height } = item.hitbox;
    const values = [x, y, width, height, item.itemAnchor.x, item.itemAnchor.y, item.bubbleAnchor.x, item.bubbleAnchor.y, ...item.outline.flatMap((point) => [point.x, point.y])];
    if (values.some((value) => !Number.isFinite(value))) throw new Error(`Non-finite coordinate: ${item.id}`);
    if (item.outline.length < 4 || x < 0 || y < 0 || width <= 0 || height <= 0 || x + width > 100 || y + height > 100 || values.some((value) => value < 0 || value > 100)) {
      throw new Error(`Coordinate outside stage: ${item.id}`);
    }
  }
}

if (import.meta.env.DEV) validateEquipment(equipment);
