import type { CSSProperties, PointerEventHandler, Ref } from "react";
import type { EquipmentItem } from "../data/equipment";

type Props = {
  item: EquipmentItem;
  active: boolean;
  buttonRef: Ref<HTMLButtonElement>;
  onFocus: () => void;
  onBlur: () => void;
  onPointerEnter: PointerEventHandler<HTMLButtonElement>;
  onPointerLeave: PointerEventHandler<HTMLButtonElement>;
  onClick: () => void;
};

export function EquipmentHotspot({ item, active, buttonRef, ...events }: Props) {
  const style = { "--x": `${item.hitbox.x}%`, "--y": `${item.hitbox.y}%`, "--w": `${item.hitbox.width}%`, "--h": `${item.hitbox.height}%` } as CSSProperties;
  return (
    <button
      ref={buttonRef}
      type="button"
      className="equipment-hotspot"
      style={style}
      aria-label={`${item.title}: ${item.technology} 장비 설명`}
      aria-expanded={active}
      aria-controls={`equipment-detail-${item.id}`}
      data-equipment={item.id}
      {...events}
    ><span aria-hidden="true" /></button>
  );
}
