import type { CSSProperties, PointerEventHandler, Ref } from "react";
import type { EquipmentItem } from "../data/equipment";

type Props = {
  item: EquipmentItem;
  subtle?: boolean;
  active: boolean;
  reacting?: boolean;
  buttonRef: Ref<HTMLButtonElement>;
  onFocus: () => void;
  onBlur: () => void;
  onPointerEnter: PointerEventHandler<HTMLButtonElement>;
  onPointerLeave: PointerEventHandler<HTMLButtonElement>;
  onClick: () => void;
};

export function EquipmentHotspot({ item, subtle = false, active, reacting = false, buttonRef, ...events }: Props) {
  const style = { "--x": `${item.hitbox.x}%`, "--y": `${item.hitbox.y}%`, "--w": `${item.hitbox.width}%`, "--h": `${item.hitbox.height}%` } as CSSProperties;
  return (
    <button
      ref={buttonRef}
      type="button"
      className={`equipment-hotspot${subtle ? " equipment-hotspot--subtle" : ""}`}
      style={style}
      aria-label={`${item.title}: ${item.technology} 장비 설명`}
      aria-expanded={active}
      aria-controls={`equipment-detail-${item.id}`}
      data-equipment={item.id}
      data-reacting={reacting || undefined}
      {...events}
    ><span aria-hidden="true" /></button>
  );
}
