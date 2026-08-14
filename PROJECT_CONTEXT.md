# My_Character MVP — Codex Context

Implement the attached task specification at `/opt/data/cache/documents/doc_13183f4bcbca_hermes_my_character_mvp.md`.

## Environment
- Workspace: `/opt/data/workspaces/My_Character`
- Empty git repository initialized on `main`; do not commit/push as Codex.
- GitHub auth is available through `/opt/data/github/bin/hermes-gh` and `/opt/data/github/bin/hermes-git`; repository `MoolMong/My_Character` was checked and does not exist. Hermes will create the public repo, manage Git, and deploy/verify Pages.
- Codex wrapper: `/opt/data/codex/bin/hermes-codex`, Codex CLI 0.147.0; invoke with model `gpt-5.6-sol`.
- Node v22.22.3, npm 10.9.8.
- Docker is not part of this MVP; do not add Docker.
- 21st MCP is registered in Codex but API key is not confirmed; do not block on it.
- Stitch MCP is not registered; do not install unofficial fallback.

## Asset
- Attached reference/temporary image has been copied to `src/assets/character-v0.png`.
- It is a full illustrated reference board containing a character and UI panels, not a transparent character-only cutout. Use it as the visible Asset v0 only if it works for the MVP, but keep rendering isolated so a future character-only asset can replace it easily. If the board is unsuitable as a central hero image, use a clean fallback silhouette/placeholding character while retaining the asset in the repo for later replacement. Do not couple hitboxes to pixels in the image.

## Product requirements
- Vite + React + TypeScript + CSS; no unnecessary UI framework.
- First screen is character-centered, 100vh-ish, restrained pixel-art style.
- Six equipment: container spear (Kubernetes/Container), private armor (OpenStack), cloud shield (AWS), Python bracer (Python), architect cloak (Terraform/IaC), Linux boots (Linux).
- Desktop hover and keyboard; mobile tap/fixed card; outside click and Escape close.
- Separate data-driven percentage hitboxes and anchor points; SVG pointer-events-none connection lines; tooltip layer separate from image.
- Accessible buttons, aria-label/expanded, keyboard Enter/Space, reduced motion.
- Mobile no overflow, bottom/floating tooltip okay.
- MVP only: simple About/Experience/Projects/Contact placeholders below hero.
- GitHub Pages workflow on main push, Vite base `/My_Character/`, deploy to Pages using official actions.
- README must explain local run, live URL, asset replacement, coordinate editing, TODO.
- Avoid secrets, unverified contact links, private/company details, third-party assets beyond supplied image.

## Required Codex passes
1. Planning only: write `docs/PRODUCT_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/CONSTRAINTS.md`, `docs/TASKS.md`; inspect asset and choose implementation approach. Do not implement yet.
2. Implementation: follow TASKS.md, implement app and GitHub Pages workflow; do not commit/push.
3. Review: recruiter/UX/accessibility/engineering review, fix issues, run npm install/build/typecheck/tests if configured; do not commit/push.

## Safety
- No repo deletion, overwrite, force push, merge, paid AWS, secrets, or production infrastructure.
- Do not claim Pages deployed; Hermes verifies after push.
- Keep image and logic replaceable; no embedded hitboxes in the image.
- Korean copy may be used for item names/descriptions; UI should remain readable.

Proceed with planning pass only now. Do not ask questions.
