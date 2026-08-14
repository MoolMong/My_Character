export function CharacterVisual({ artwork }: { artwork: string }) {
  return (
    <div className="character-visual" aria-hidden="true">
      <img src={artwork} alt="" />
    </div>
  );
}
