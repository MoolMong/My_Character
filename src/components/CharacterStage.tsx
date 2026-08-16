import { useCallback, useEffect, useRef, useState } from "react";
import { characterConfig } from "../data/characterConfigs";
import { useFinePointer } from "../hooks/useFinePointer";
import { CharacterVisual } from "./CharacterVisual";
import { EquipmentHotspot } from "./EquipmentHotspot";
import { EquipmentTooltip } from "./EquipmentTooltip";

type Mode = "hover" | "focus" | "pinned" | null;
export function CharacterStage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>(null);
  const finePointer = useFinePointer();
  const explorerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const active = characterConfig.hotspots.find((item) => item.id === activeId) ?? null;
  const hotspotDebug = import.meta.env.DEV && new URLSearchParams(window.location.search).get("motionDebug") === "1";

  const close = useCallback((restoreFocus = false) => {
    const id = activeId;
    setActiveId(null);
    setMode(null);
    if (restoreFocus && id) requestAnimationFrame(() => buttonRefs.current.get(id)?.focus());
  }, [activeId]);

  const togglePinned = (id: string) => {
    if (activeId === id && mode === "pinned") close();
    else { setActiveId(id); setMode("pinned"); }
  };

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (mode !== "pinned") return;
      if (!explorerRef.current?.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && activeId) close(mode === "pinned");
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeId, close, mode]);

  return (
    <div className="equipment-explorer" ref={explorerRef} role="group" aria-label="인터랙티브 캐릭터 장비 보드" data-hotspot-debug={hotspotDebug || undefined}>
      {hotspotDebug && <p className="debug-label" aria-hidden="true">hotspot debug · static board</p>}
      <div className="stage-shell" style={{ aspectRatio: `${characterConfig.width} / ${characterConfig.height}` }}>
        <div className="character-stage" data-testid="character-stage" data-config={characterConfig.id}>
          <div className="character-scene">
            <CharacterVisual config={characterConfig} />
            <div className="hotspot-layer">
              {characterConfig.hotspots.map((item) => (
                <EquipmentHotspot
                  key={item.id}
                  item={item}
                  subtle
                  active={activeId === item.id}
                  buttonRef={(node) => { if (node) buttonRefs.current.set(item.id, node); else buttonRefs.current.delete(item.id); }}
                  onPointerEnter={() => { if (finePointer && mode !== "pinned") { setActiveId(item.id); setMode("hover"); } }}
                  onPointerLeave={() => { if (finePointer && mode === "hover" && activeId === item.id) close(); }}
                  onFocus={() => { if (mode !== "pinned") { setActiveId(item.id); setMode("focus"); } }}
                  onBlur={() => { if (mode === "focus" && activeId === item.id) close(); }}
                  onClick={() => togglePinned(item.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="equipment-detail-slot" aria-live="polite">
        {active && <EquipmentTooltip item={active} onClose={() => close(mode === "pinned")} />}
      </div>
    </div>
  );
}
