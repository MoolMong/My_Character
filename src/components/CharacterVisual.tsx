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
      <svg className="character-motion" viewBox="0 0 100 150" preserveAspectRatio="none" focusable="false">
        <g className="torso-breath" data-motion-layer="breath">
          <path className="torso-breath__halo" d="M39 64l3-8 6-2h4l6 2 3 8-4 5H43z" />
          <path className="torso-breath__spark" d="M49 58h2v2h2v2h-2v2h-2v-2h-2v-2h2z" />
        </g>
        <g className="cape-breeze" data-motion-layer="cape">
          <path d="M71 70h4v2h4v2h-6v-2h-2z" />
          <path d="M75 76h5v2h3v2h-5v-2h-3z" />
        </g>
        <g className="ahoge-glint" data-motion-layer="ahoge">
          <path d="M51 17h1v2h1v1h-2v-1h-1v-1h1z" />
        </g>
      </svg>
    </div>
  );
}
