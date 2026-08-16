import type { EquipmentItem } from "../data/equipment";

export function EquipmentTooltip({ item, onClose }: { item: EquipmentItem; onClose: () => void }) {
  return (
    <div id={`equipment-detail-${item.id}`} className="equipment-detail" role="region" aria-labelledby={`equipment-title-${item.id}`}>
      <button type="button" className="tooltip-close" onClick={onClose} aria-label={`${item.title} 설명 닫기`}>×</button>
      <p className="technology">{item.technology}</p>
      <h2 id={`equipment-title-${item.id}`}>{item.title}</h2>
      <p>{item.description}</p>
    </div>
  );
}
