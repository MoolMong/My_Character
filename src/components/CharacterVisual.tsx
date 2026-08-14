import type { CharacterConfig } from "../data/characterConfigs";

export function CharacterVisual({ config }: { config: CharacterConfig }) {
  const baseFrame = config.frames[0];

  return (
    <div className="character-visual" aria-hidden="true" data-floor-y={config.floorY}>
      <img
        className="character-frame"
        src={baseFrame.artwork}
        alt=""
        data-frame={baseFrame.id}
        data-floor-y={baseFrame.floorY}
      />
    </div>
  );
}
