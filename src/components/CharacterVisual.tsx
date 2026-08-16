import type { CharacterConfig } from "../data/characterConfigs";

export function CharacterVisual({ config }: { config: CharacterConfig }) {
  return (
    <div className="character-visual">
      <img
        className="character-board"
        src={config.artwork}
        width={config.width}
        height={config.height}
        alt=""
        draggable="false"
      />
    </div>
  );
}
