import { useEffect, useState } from "react";
import type { CharacterConfig } from "../data/characterConfigs";

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
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="character-visual"
      aria-hidden="true"
      data-floor-y={config.floorY}
      data-motion-state={reactionId ? "equipment-reaction" : "idle"}
      data-reduced-motion={reducedMotion || undefined}
    >
      <img className="character-master" src={config.baseArtwork} alt="" data-layer="fixed-master" />
      <img className="motion-layer motion-layer--torso" src={config.baseArtwork} alt="" data-layer="upper-body-breathe" />
      <img className="motion-layer motion-layer--cape" src={config.baseArtwork} alt="" data-layer="cape-settle" />
      <img className="motion-layer motion-layer--spear" src={config.baseArtwork} alt="" data-layer="spear-tip-settle" />
      <img className="motion-layer motion-layer--hair" src={config.baseArtwork} alt="" data-layer="hair-ahoge-sway" />
      <img className="motion-layer motion-layer--face" src={config.baseArtwork} alt="" data-layer="face-eye-expression" />
      <span className="ground-shadow" data-layer="ground-shadow" data-reacting={reactionId || undefined} />
    </div>
  );
}
