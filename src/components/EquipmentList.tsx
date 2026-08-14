import type { EquipmentItem } from "../data/equipment";

export function EquipmentList({ items, hidden }: { items: EquipmentItem[]; hidden: boolean }) {
  return (
    <section
      id="all-equipment-explanations"
      className="equipment-list-panel"
      aria-labelledby="all-equipment-title"
      hidden={hidden}
    >
      <h2 id="all-equipment-title">장비 설명</h2>
      <div className="equipment-list">
        {items.map((item) => (
          <article className="equipment-card" key={item.id}>
            <p className="technology">{item.technology}</p>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
