import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { CharacterConfig } from "../data/characterConfigs";

type IdlePhase = "idle" | "inhale" | "settle";

const phases: { phase: IdlePhase; frame: "idle" | "breathe"; min: number; variance: number }[] = [
  { phase: "idle", frame: "idle", min: 720, variance: 420 },
  { phase: "inhale", frame: "breathe", min: 210, variance: 90 },
  { phase: "settle", frame: "idle", min: 320, variance: 150 },
  { phase: "inhale", frame: "breathe", min: 180, variance: 80 },
  { phase: "idle", frame: "idle", min: 820, variance: 480 },
];

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

export function CharacterVisual({ config, reacting = false }: { config: CharacterConfig; reacting?: boolean }) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [blinking, setBlinking] = useState(false);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    if (reducedMotion || reacting) {
      setBlinking(false);
      return;
    }
    const phase = phases[phaseIndex];
    const timer = window.setTimeout(
      () => setPhaseIndex((current) => (current + 1) % phases.length),
      phase.min + Math.random() * phase.variance,
    );
    return () => window.clearTimeout(timer);
  }, [phaseIndex, reacting, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || reacting) return;
    let blinkTimer = 0;
    let restoreTimer = 0;
    const schedule = () => {
      blinkTimer = window.setTimeout(() => {
        setBlinking(true);
        restoreTimer = window.setTimeout(() => {
          setBlinking(false);
          schedule();
        }, 105 + Math.random() * 35);
      }, 3500 + Math.random() * 3500);
    };
    schedule();
    return () => {
      window.clearTimeout(blinkTimer);
      window.clearTimeout(restoreTimer);
    };
  }, [reacting, reducedMotion]);

  const visibleFrame = blinking ? "blink" : phases[phaseIndex].frame;

  return (
    <div className="character-visual" aria-hidden="true" data-floor-y={config.floorY} data-phase={phases[phaseIndex].phase} data-reacting={reacting || undefined}>
      {config.frames.map((frame) => (
        <img
          key={frame.id}
          className="character-frame"
          src={frame.artwork}
          alt=""
          data-frame={frame.id}
          data-active={visibleFrame === frame.id || undefined}
          data-floor-y={frame.floorY}
          style={{ "--floor-offset": `${Number((frame.floorY - config.floorY).toFixed(3))}%` } as CSSProperties}
        />
      ))}
    </div>
  );
}
