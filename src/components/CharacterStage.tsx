import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { characterConfigs, type CharacterConfigId } from "../data/characterConfigs";
import { equipment } from "../data/equipment";
import { useFinePointer } from "../hooks/useFinePointer";
import { CharacterVisual } from "./CharacterVisual";
import { ConnectionLine } from "./ConnectionLine";
import { EquipmentHotspot } from "./EquipmentHotspot";
import { EquipmentList } from "./EquipmentList";
import { EquipmentTooltip } from "./EquipmentTooltip";

type Mode = "hover" | "focus" | "pinned" | null;
type Geometry = { width: number; height: number; end: { x: number; y: number } };

export function CharacterStage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>(null);
  const [showAll, setShowAll] = useState(false);
  const [configId, setConfigId] = useState<CharacterConfigId>("equipment-board");
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const finePointer = useFinePointer();
  const explorerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const config = characterConfigs.find((item) => item.id === configId) ?? characterConfigs[0];
  const active = config.equipment.find((item) => item.id === activeId) ?? null;

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

  const selectConfig = (id: CharacterConfigId) => {
    if (id === configId) return;
    setActiveId(null);
    setMode(null);
    setGeometry(null);
    buttonRefs.current.clear();
    setConfigId(id);
  };

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (mode !== "pinned") return;
      const target = event.target as Node;
      if (!explorerRef.current?.contains(target)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && activeId) close(mode === "pinned");
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("pointerdown", onPointerDown); document.removeEventListener("keydown", onKeyDown); };
  }, [activeId, close, mode]);

  const measure = useCallback(() => {
    if (!active || !stageRef.current || !tooltipRef.current) { setGeometry(null); return; }
    const stage = stageRef.current.getBoundingClientRect();
    const tip = tooltipRef.current.getBoundingClientRect();
    const edgeX = active.tooltipSide === "left" ? tip.right : tip.left;
    setGeometry({ width: stage.width, height: stage.height, end: { x: edgeX - stage.left, y: tip.top + tip.height / 2 - stage.top } });
  }, [active]);

  useLayoutEffect(() => {
    measure();
    if (!active || !stageRef.current || !tooltipRef.current) return;
    const observer = new ResizeObserver(measure);
    observer.observe(stageRef.current);
    observer.observe(tooltipRef.current);
    window.addEventListener("resize", measure);
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [active, measure]);

  return (
    <div className="equipment-explorer" ref={explorerRef}>
      <div className="visual-config-switcher" role="group" aria-label="캐릭터 화면 선택">
        {characterConfigs.map((option) => (
          <button key={option.id} type="button" aria-pressed={option.id === configId} onClick={() => selectConfig(option.id)}>
            {option.label}
          </button>
        ))}
      </div>
      <div className="stage-shell" style={{ aspectRatio: `${config.width} / ${config.height}` }}>
        <div className="character-stage" ref={stageRef} data-testid="character-stage" data-config={config.id}>
          <div className={`character-scene${config.portrait ? " character-scene--portrait" : ""}`}>
            <CharacterVisual artwork={config.artwork} />
            {active && geometry && (
              <ConnectionLine width={geometry.width} height={geometry.height} start={{ x: geometry.width * active.anchor.x / 100, y: geometry.height * active.anchor.y / 100 }} end={geometry.end} />
            )}
            <div className="hotspot-layer">
              {config.equipment.map((item) => (
                <EquipmentHotspot
                  key={item.id}
                  item={item}
                  subtle={config.portrait}
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
        <div className="tooltip-layer" aria-live="polite">
          {active && <EquipmentTooltip ref={tooltipRef} item={active} onClose={() => close(mode === "pinned")} />}
        </div>
      </div>
      <button
        type="button"
        className="all-equipment-toggle"
        aria-pressed={showAll}
        aria-expanded={showAll}
        aria-controls="all-equipment-explanations"
        onClick={() => setShowAll((visible) => !visible)}
      >
        {showAll ? "설명 모두 닫기" : "장비 설명 모두 보기"}
      </button>
      <EquipmentList items={equipment} hidden={!showAll} />
    </div>
  );
}
