import { forwardRef } from "react";
import type { EquipmentItem } from "../data/equipment";

export const EquipmentTooltip = forwardRef<HTMLDivElement, { item: EquipmentItem; onClose: () => void }>(function EquipmentTooltip({ item, onClose }, ref) {
  return (
    <div ref={ref} id={`equipment-detail-${item.id}`} className={`equipment-tooltip side-${item.tooltipSide}`} role="region" aria-labelledby={`equipment-title-${item.id}`}>
      <button type="button" className="tooltip-close" onClick={onClose} aria-label={`${item.title} 설명 닫기`}>×</button>
      <p className="technology">{item.technology}</p>
      <h2 id={`equipment-title-${item.id}`}>{item.title}</h2>
      <p>{item.description}</p>
    </div>
  );
});
