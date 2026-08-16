import type { CharacterConfig } from "../data/characterConfigs";

export function CharacterVisual({ config }: { config: CharacterConfig }) {
  return (
    <div className="character-visual">
      {config.frames.map((frame, index) => <img key={frame} className={`character-frame character-frame--${index}`} src={frame} width={config.width} height={config.height} alt="" draggable="false" aria-hidden={index !== 0} />)}
    </div>
  );
}
