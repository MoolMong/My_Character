import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { characterConfig } from "../data/characterConfigs";
import { useFinePointer } from "../hooks/useFinePointer";
import { CharacterVisual } from "./CharacterVisual";
import { ConnectionLine } from "./ConnectionLine";
import { EquipmentHotspot } from "./EquipmentHotspot";
import { EquipmentTooltip } from "./EquipmentTooltip";

type Mode = "hover" | "focus" | "pinned" | null;
type Geometry = { width: number; height: number; end: { x: number; y: number } };

export function CharacterStage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>(null);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const [reactionId, setReactionId] = useState<string | null>(null);
  const finePointer = useFinePointer();
  const explorerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const reactionTimer = useRef<number | null>(null);
  const active = characterConfig.hotspots.find((item) => item.id === activeId) ?? null;
  const motionDebug = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("motionDebug") === "1";

  const close = useCallback((restoreFocus = false) => {
    const id = activeId;
    setActiveId(null);
    setMode(null);
    if (restoreFocus && id) requestAnimationFrame(() => buttonRefs.current.get(id)?.focus());
  }, [activeId]);

  const togglePinned = (id: string) => {
    if (reactionTimer.current) window.clearTimeout(reactionTimer.current);
    setReactionId(id);
    reactionTimer.current = window.setTimeout(() => setReactionId(null), 240);
    if (activeId === id && mode === "pinned") close();
    else { setActiveId(id); setMode("pinned"); }
  };

  useEffect(() => () => {
    if (reactionTimer.current) window.clearTimeout(reactionTimer.current);
  }, []);

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
    <div className="equipment-explorer" ref={explorerRef} role="group" aria-label="인터랙티브 캐릭터">
      <div className="stage-shell" style={{ aspectRatio: `${characterConfig.width} / ${characterConfig.height}` }}>
        <div className="character-stage" ref={stageRef} data-testid="character-stage" data-config={characterConfig.id} data-motion-debug={motionDebug || undefined}>
          <div className="character-scene">
            <CharacterVisual config={characterConfig} reactionId={reactionId} />
            {active && geometry && (
              <ConnectionLine width={geometry.width} height={geometry.height} start={{ x: geometry.width * active.anchor.x / 100, y: geometry.height * active.anchor.y / 100 }} end={geometry.end} />
            )}
            <div className="hotspot-layer">
              {characterConfig.hotspots.map((item) => (
                <EquipmentHotspot
                  key={item.id}
                  item={item}
                  subtle
                  active={activeId === item.id}
                  reacting={reactionId === item.id}
                  buttonRef={(node) => { if (node) buttonRefs.current.set(item.id, node); else buttonRefs.current.delete(item.id); }}
                  onPointerEnter={() => { if (finePointer && mode !== "pinned") { setActiveId(item.id); setMode("hover"); } }}
                  onPointerLeave={() => { if (finePointer && mode === "hover" && activeId === item.id) close(); }}
                  onFocus={() => { if (mode !== "pinned") { setActiveId(item.id); setMode("focus"); } }}
                  onBlur={() => { if (mode === "focus" && activeId === item.id) close(); }}
                  onClick={() => togglePinned(item.id)}
                />
              ))}
            </div>
            {motionDebug && (
              <output className="motion-debug" aria-label="Motion debug data">
                state: {reactionId ? `reaction:${reactionId}` : "idle"}<br />
                master: character-frame-idle.png<br />
                layers: fixed-master, hair-ahoge-sway, ground-shadow<br />
                offsets: master 0px / baseline {characterConfig.floorY}%
              </output>
            )}
          </div>
        </div>
        <div className="tooltip-layer" aria-live="polite">
          {active && <EquipmentTooltip ref={tooltipRef} item={active} onClose={() => close()} />}
        </div>
      </div>
    </div>
  );
}
