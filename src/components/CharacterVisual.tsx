import { useEffect, useState } from "react";
import type { CharacterConfig } from "../data/characterConfigs";

const FRAME_HOLDS_MS = [720, 440, 300, 400, 620] as const;

export function CharacterVisual({ config, debug = false }: { config: CharacterConfig; debug?: boolean }) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      setReducedMotion(query.matches);
      if (query.matches) setFrameIndex(0);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setFrameIndex(0);
      return;
    }
    const timeout = setTimeout(
      () => setFrameIndex((current) => (current + 1) % config.frames.length),
      FRAME_HOLDS_MS[frameIndex],
    );
    return () => clearTimeout(timeout);
  }, [config.frames.length, frameIndex, reducedMotion]);

  const activeFrame = config.frames[frameIndex];

  return (
    <div className="character-visual" aria-hidden="true" data-floor-y={config.floorY}>
      {config.frames.map((frame, index) => (
        <img
          className="character-frame"
          src={frame.artwork}
          alt=""
          data-frame={frame.id}
          data-frame-index={index}
          data-floor-y={frame.floorY}
          hidden={index !== frameIndex}
          key={frame.id}
        />
      ))}
      {debug && <span className="frame-debug">frame {frameIndex} · {activeFrame.id} · floor {config.floorY}%</span>}
    </div>
  );
}
