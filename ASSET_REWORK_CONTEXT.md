# Asset and equipment rework

Task: remove the baked white/off-white rectangle from the two portrait PNGs so the page shows the character cutout on the existing dark background, then expand the same single-character interaction to spear and shield (in addition to gloves and shoes).

Repo: /opt/data/workspaces/My_Character, Vite React TypeScript, branch feat/mvp-interaction, live https://moolmong.github.io/My_Character/. Existing clean commit 7abf6c1; do not reset/rebase/force push. Existing backup tags prototype-v0.1 and prototype-v0.2-pre-rework must remain.

Current main files: src/data/characterConfigs.ts, src/components/CharacterStage.tsx, CharacterVisual.tsx, EquipmentHotspot.tsx, EquipmentTooltip.tsx, styles.css. Two portrait PNGs are 1024x1536 and currently RGB with a baked near-white background. They are the main two idle frames. Need preserve frame baseline and idle crossfade.

User request:
- Do not leave white background behind character. Make background transparent/removed following character outline, not a rectangular crop. Use a reproducible local asset preprocessing script/tool (prefer standard image tooling already available; if unavailable use a small documented Python/Pillow/stdlib alternative only if needed). Do not claim pixel-perfect if not validated. Preserve original PNGs and backup tags; create processed runtime assets with clear names, e.g. character-portrait-a-cutout.png/b-cutout.png. Document preprocessing and limitations.
- Keep one character, two frames, floor baseline fixed, no whole-image bobbing. Use processed cutouts in main DOM.
- Add data-driven hotspots and placeholder copy for spear and shield as well as gloves and shoes. New items: spear/weapon likely left vertical weapon region; shield likely right body/arm region. Use percentage coordinates in characterConfig, keep copy clearly editable placeholders. Do not invent user-specific accomplishments. Keep 4 buttons, tooltip and keyboard/tap/outside/Escape support. Existing UI no selectors/board.
- Add/update focused tests, README/docs.
- Run npm run typecheck, npm test, npm run build. Do not commit/push; Hermes validates and owns git/deploy.

Important asset safety:
- Do not overwrite character-portrait-a.png or b.png; keep them intact for recovery/reference. Runtime imports may be changed to processed files.
- Background removal should avoid destroying light-colored character details; inspect both images after processing and keep thresholds/documentation adjustable.
- Do not touch unrelated files.

Proceed as a focused implementation/review pass now, then run checks and fix failures.