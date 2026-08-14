# Dynamic pixel character rework

Repo: /opt/data/workspaces/My_Character. Existing one-character app, Vite React TS, GitHub Pages at https://moolmong.github.io/My_Character/. Current commit d287c34, backups prototype-v0.1 and prototype-v0.2-pre-rework. Do not reset/rebase/force-push. Codex must not commit/push/deploy; Hermes owns that.

Authoritative task: /opt/data/cache/documents/doc_18df27fe9869_hermes_my_character_dynamic_site-2.md.

Four attached images were supplied in the user message and may be available under /opt/data/cache/images (img_98d9fb6d1a36.png, img_e827c1ed7459.png, img_c02d25469c6f.png, img_99edfd3d105d.png). The task mentions a ZIP with assets/frame_00_original.png through frame_04_settle.png, but no ZIP/frame files were found in the initial cache scan. Do not invent missing assets. Inspect /opt/data/cache/documents and /opt/data/cache/images and, if no ZIP exists, use the four supplied images as available frame candidates or state the exact blocker; do not stop the rest of the work.

Current main uses two processed cutout frames:
- src/assets/character-portrait-a-cutout.png
- src/assets/character-portrait-b-cutout.png
Originals retained. Current CharacterVisual renders two img layers. Current CharacterStage has four hotspots: spear, shield, gloves, shoes. Current CSS uses a 3.8s opacity crossfade and tiny scale, with fixed floor offsets. Current tests: 9 pass.

Goal:
- one character only; no frame/character/board selector
- use supplied new frames where available; if absent, keep current cutouts and document missing ZIP
- normalize frame dimensions/background/transparent cutout, fixed floor baseline and scale
- natural dynamic idle with multiple states, not simple A/B constant crossfade; use CSS or small state machine, no infinite RAF
- if a blink frame exists, rare blink event separate from base breathing; otherwise do not fabricate
- avoid ghosting: short 40-120ms blend or discrete state timing as appropriate
- fixed feet, no whole-PNG bobbing
- retain four equipment interactions with data-driven placeholder content and tooltip: spear/shield/gloves/shoes
- active reaction may pause briefly or glow; preserve accessibility/reduced motion/mobile
- keep lower sections

Required: inspect current state and assets; implement focused changes; run npm run typecheck, npm test, npm run build; do not commit/push.

Do not put credentials or private details into repo.
