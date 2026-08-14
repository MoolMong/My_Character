import characterArtwork from "../assets/character-v1.png";

export function CharacterVisual() {
  return (
    <div className="character-visual" aria-hidden="true">
      <img src={characterArtwork} alt="" />
    </div>
  );
}
