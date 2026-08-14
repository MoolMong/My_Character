# Interaction v0.1 Codex Context

Authoritative task: /opt/data/cache/documents/doc_dc0b267a749a_hermes_work_character_interaction_v01.md

Repository: /opt/data/workspaces/My_Character
Stack: Vite + React + TypeScript + CSS. Existing live app is GitHub Pages at https://moolmong.github.io/My_Character/.
Current branch: feat/mvp-interaction. Existing main and feature branch point to the prior deployed app. Hermes created annotated backup tag `prototype-v0.1` at the pre-change HEAD before this task. Two new supplied images are staged in `src/assets/prototype-v0.1/` only for backup/reference; use them as the new live character assets only after planning.

Two supplied images:
- /opt/data/cache/images/img_8f0d225f089c.png (shown as first attached image; transparent/white background pixel character, one pose)
- /opt/data/cache/images/img_fe66a96eeac2.png (shown as second attached image; similar character pose)
They are portrait character renders. Exact image dimensions should be checked with available standard tools; do not invent values. Use each image as a separate character state/config if appropriate. Do not assume which state means gloves/shoes without visual inspection; determine sensible mappings and keep it easy to change.

User requirements:
- Preserve current site structure/style as much as possible; no redesign.
- Apply both images naturally.
- CSS transform-based subtle breathing/idle, no JS animation loop, reduced motion.
- Transparent percentage-based glove and shoe hotspots, separate per image/config, click/tap desktop/mobile, subtle hover/selected feedback.
- Clicking glove/shoe shows UI but supplied images contain no actual explanatory copy. Do not invent user-specific facts. Use clearly marked editable placeholder copy in data (e.g. “설명 준비 중 — 이 문구를 교체하세요.”) and document exact edit location.
- Existing equipment explanation toggle and other interactions must not regress.
- Responsive desktop, mobile portrait/landscape; no overflow.
- Codex should analyze current structure, implement, test, and review. Do not commit/push/deploy.

Hermes owns:
- final git status/diff/checks, commit and push according to current repo policy; deployment only after explicit scope from this task (user asked work task; existing site is already deployed; update may be pushed if safe under repo policy).
- Do not use force push, reset/rebase, delete existing data, or change unrelated features.

Required Codex workflow:
1. Read current source and inspect supplied assets. Write `docs/INTERACTION_V01_PLAN.md` before implementation with structure, coordinate strategy, state mapping, risks, and test plan. Do not change runtime files in this planning pass.
2. Hermes reviews only for obvious mismatch/safety, then Codex implements the requested scope.
3. Codex runs typecheck/tests/build and adds/updates focused tests.
4. Codex performs a review pass and fixes issues; no commit/push.

Current existing implementation notes:
- `CharacterStage.tsx` owns active hotspot state, tooltip, SVG line and equipment all-toggle.
- `CharacterVisual.tsx` currently renders `character-v1.png` as isolated art.
- equipment records are in `src/data/equipment.ts` with percentage hitbox/anchor data.
- `EquipmentTooltip.tsx`, `EquipmentList.tsx`, `ConnectionLine.tsx` exist.
- Existing tests: `src/components/CharacterStage.test.tsx`, `src/data/equipment.test.ts`.
- Current npm scripts: dev, build, typecheck, test, preview.

Do not commit or push. Proceed with planning pass only.