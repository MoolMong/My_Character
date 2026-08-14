import { useEffect, useState } from "react";
import type { CharacterConfig } from "../data/characterConfigs";

type Accent = "none" | "clasp" | "spear";

function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}

export function CharacterVisual({ config, reactionId = null }: { config: CharacterConfig; reactionId?: string | null }) {
  const [accent, setAccent] = useState<Accent>("none");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || reactionId) {
      setAccent("none");
      return;
    }

    let eventTimer = 0;
    let clearTimer = 0;
    const schedule = () => {
      eventTimer = window.setTimeout(() => {
        setAccent(Math.random() < 0.58 ? "clasp" : "spear");
        clearTimer = window.setTimeout(() => {
          setAccent("none");
          schedule();
        }, 150);
      }, 5200 + Math.random() * 7400);
    };
    schedule();
    return () => {
      window.clearTimeout(eventTimer);
      window.clearTimeout(clearTimer);
    };
  }, [reactionId, reducedMotion]);

  return (
    <div
      className="character-visual"
      aria-hidden="true"
      data-floor-y={config.floorY}
      data-motion-state={reactionId ? "equipment-reaction" : "idle"}
      data-accent={accent}
      data-reduced-motion={reducedMotion || undefined}
    >
      <img className="character-master" src={config.baseArtwork} alt="" data-layer="fixed-master" />
      <span className="local-accent local-accent--clasp" data-layer="clasp-pixel" />
      <span className="local-accent local-accent--spear" data-layer="spear-pixel" />
      <span className="ground-shadow" data-layer="ground-shadow" data-reacting={reactionId || undefined} />
    </div>
  );
}
