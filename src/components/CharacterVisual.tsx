import type { CSSProperties } from "react";
import type { CharacterConfig } from "../data/characterConfigs";

export function CharacterVisual({ config }: { config: CharacterConfig }) {
  return (
    <div className="character-visual" aria-hidden="true" data-floor-y={config.floorY}>
      {config.frames.map((frame, index) => (
        <img
          key={frame.id}
          className={`character-frame character-frame--${index + 1}`}
          src={frame.artwork}
          alt=""
          data-frame={frame.id}
          data-floor-y={frame.floorY}
          style={{ "--floor-offset": `${Number((frame.floorY - config.floorY).toFixed(3))}%` } as CSSProperties}
        />
      ))}
    </div>
  );
}
