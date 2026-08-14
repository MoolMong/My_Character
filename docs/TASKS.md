# My_Character MVP Task Plan

This plan governs the later implementation and review passes. Check tasks only after they are completed and verified. Codex must not commit or push; Hermes owns repository creation, Git history, and live Pages verification.

## Pass 1 — Planning

- [x] Read the source task specification and repository context.
- [x] Inspect the supplied `src/assets/character-v0.png`.
- [x] Choose the asset approach: retain the board unchanged as reference-only and use an isolated CSS fallback visual for the MVP hero.
- [x] Define product behavior and acceptance criteria in `docs/PRODUCT_SPEC.md`.
- [x] Define component, state, geometry, responsive, and deployment architecture in `docs/ARCHITECTURE.md`.
- [x] Record scope, safety, asset, accessibility, privacy, and deployment constraints in `docs/CONSTRAINTS.md`.
- [x] Write this ordered implementation and review plan.

Stop after these documents during the planning pass.

## Pass 2 — Implementation

### 2.1 Project foundation

- [ ] Initialize a minimal Vite React TypeScript project in the existing repository without removing supplied files or planning docs.
- [ ] Configure TypeScript strictness, practical npm scripts (`dev`, `build`, `typecheck`, `preview`), and Vite base `/My_Character/`.
- [ ] Keep dependencies minimal and generate a deterministic `package-lock.json` compatible with `npm ci`.
- [ ] Establish semantic global HTML, local/system typography, palette variables, focus styles, box sizing, and responsive page foundations in plain CSS.
- [ ] Confirm there are no remote font, icon, image, analytics, or secret dependencies.

### 2.2 Content and coordinate data

- [ ] Implement the typed equipment data contract and all six required entries in `src/data/equipment.ts`.
- [ ] Store hitboxes and anchors as separate percentage objects; store preferred tooltip side separately.
- [ ] Add development-time validation for IDs and 0–100 coordinate bounds, or cover those invariants with tests if a test runner is warranted.
- [ ] Use only neutral, approved Korean item copy and technology labels; do not invent experience details.
- [ ] Choose and document the provisional CSS-fallback coordinate map.

### 2.3 Replaceable character stage

- [ ] Implement `CharacterVisual` as decorative, original CSS fallback art with recognizable spear, armor, shield, bracer, cloak, and boots; include no technology logos.
- [ ] Keep `src/assets/character-v0.png` unchanged and do not render it as the central hero.
- [ ] Implement `CharacterStage` with a stable responsive coordinate space and four independent visual/line/hotspot/tooltip layers.
- [ ] Ensure replacing `CharacterVisual` with a transparent image would require no interaction-component rewrite.
- [ ] Add a subtle idle animation based on transform only.

### 2.4 Hotspot and interaction behavior

- [ ] Render each percentage hitbox as a native button with clear `aria-label`, `aria-controls`, and accurate `aria-expanded`.
- [ ] Provide a strong visible focus indicator and an active treatment that does not rely only on color.
- [ ] Implement one-item state with hover, focus, and pinned activation modes.
- [ ] Gate pointer hover semantics to fine, hover-capable pointers.
- [ ] Confirm native Enter/Space activation toggles pinned details without double-firing custom keyboard handlers.
- [ ] Make touch/coarse-pointer taps pin and switch the active item.
- [ ] Close pinned state on outside pointer interaction while ignoring interaction inside the stage/card.
- [ ] Close on Escape and restore focus appropriately.
- [ ] Avoid hover/focus dismissal flicker and clean up all document/media listeners.

### 2.5 Tooltip and SVG connection

- [ ] Build one reusable tooltip/card component with item title, technology, and description.
- [ ] Use accessible contextual-region semantics and stable IDs; do not force focus into a non-modal information card.
- [ ] Position desktop cards in reserved left/right stage space and clamp them within the layout.
- [ ] Switch mobile cards to a bottom/floating viewport-safe layout, including safe-area padding and a visible close affordance if helpful.
- [ ] Render a stage-sized, assistive-technology-hidden SVG with `pointer-events: none`.
- [ ] Start the active line at the item anchor and compute its endpoint from the rendered tooltip-facing edge.
- [ ] Recalculate line geometry using stage/tooltip refs and `ResizeObserver`; avoid per-item pixel endpoint constants.
- [ ] Animate line/card appearance within 200–400 ms without excessive effects.
- [ ] Hide the connection line on the narrowest layout only if its route obscures content, retaining hotspot/card association through other cues.

### 2.6 Page content and responsive styling

- [ ] Build a `min-height: 100svh` hero with one `h1`, role label, generic Korean introduction, and discoverability instruction.
- [ ] Ensure the character remains the visual focus and inactive equipment panels are absent.
- [ ] Add semantic, clearly placeholder-level About, Experience, Projects, and Contact sections.
- [ ] Add a skip link or equivalent efficient keyboard path past the six equipment controls.
- [ ] Add defensive wrapping and sizing so the page has no horizontal overflow at 320 px.
- [ ] Support wide desktop, tablet, narrow phone, zoom, long Korean labels, and browser safe areas.
- [ ] Implement `prefers-reduced-motion` rules that stop idle movement and minimize line/card transitions.

### 2.7 Documentation

- [ ] Write `README.md` with project purpose, current MVP features, stack, prerequisites, install/run/build commands, and expected Pages URL.
- [ ] Mark the live URL as pending Hermes deployment verification; do not claim it is deployed.
- [ ] Explain why the supplied board is reference-only and how to replace the character visual with a transparent asset.
- [ ] Explain the percentage coordinate system, hitbox/anchor editing, tooltip side editing, and recalibration workflow.
- [ ] Document meaningful TODOs: final art, verified portfolio content/links, coordinate recalibration, and optional tests/content expansion.

### 2.8 GitHub Pages workflow

- [ ] Add `.github/workflows/deploy-pages.yml` triggered by `main` push and manual dispatch.
- [ ] Use official checkout, Node setup, Pages configuration, Pages artifact upload, and Pages deployment actions at current stable major versions.
- [ ] Configure npm caching, `npm ci`, the production build, least-privilege permissions, concurrency, and the `github-pages` environment.
- [ ] Confirm the built asset URLs use `/My_Character/` and the uploaded artifact is the Vite `dist` directory.
- [ ] Do not create the repository, change remote state, push, or report a live deployment.

## Pass 3 — Review and correction

### 3.1 Automated verification

- [ ] Run `npm install` (or `npm ci` once the lockfile is established) successfully and audit terminal output for actionable errors without performing unrelated upgrades.
- [ ] Run the configured TypeScript check successfully.
- [ ] Run the production build successfully.
- [ ] Run configured tests if a test runner exists; otherwise explicitly report that no automated test suite is configured.
- [ ] Inspect the generated `dist` references for the `/My_Character/` base path.
- [ ] Review `git status` to enumerate changes without committing or pushing.

### 3.2 Recruiter review

- [ ] Confirm role and professional focus are understandable within the initial viewport.
- [ ] Confirm each technology maps to a concise skill statement and no copy overclaims experience.
- [ ] Confirm placeholders look intentional and no fake contact path or private/company information is present.
- [ ] Confirm the interaction supports quick scanning and the character does not obscure essential meaning.

### 3.3 UX review

- [ ] Exercise all six items with fine-pointer hover, switching, and leave behavior.
- [ ] Exercise all six with tap/coarse-pointer emulation, switching, card close, outside close, and no synthetic-hover trap.
- [ ] Check card/line alignment after resize and while switching tooltip sides.
- [ ] Check 320 px, common phone, tablet, and desktop widths for clipping and horizontal overflow.
- [ ] Check 200% zoom and long text wrapping.
- [ ] Check that motion is restrained and dismissal does not flicker.

### 3.4 Accessibility review

- [ ] Navigate from the top using only keyboard; verify logical order, visible focus, Enter/Space activation, Escape, and focus restoration.
- [ ] Verify accessible names, `aria-expanded`, `aria-controls`, stable IDs, heading hierarchy, regions, and decorative hiding through browser accessibility inspection.
- [ ] Verify all tooltip information is available without hover and no essential relationship depends solely on the SVG line or color.
- [ ] Emulate reduced motion and confirm idle/line/card motion is removed or minimized.
- [ ] Check text, control, active, and focus contrast against WCAG AA expectations.
- [ ] Check mobile card safe areas, target usability, and content at increased text size.

### 3.5 Engineering and security review

- [ ] Confirm equipment content/coordinates are data-driven and no hotspot is coupled to image pixels or embedded in art.
- [ ] Confirm component boundaries keep art, buttons, SVG, and tooltips replaceable.
- [ ] Inspect listener lifecycle, state transitions, ResizeObserver cleanup, stable keys/IDs, and layout measurement behavior.
- [ ] Confirm no unnecessary dependencies, secrets, remote assets, unsafe HTML, analytics, private details, Docker, or production infrastructure were added.
- [ ] Confirm workflow permissions and action provenance are appropriate and README deployment claims are accurate.
- [ ] Fix discovered in-scope issues, then rerun all affected checks.

## Hermes handoff (not Codex actions)

- [ ] Hermes creates the public `MoolMong/My_Character` repository.
- [ ] Hermes reviews and commits the working tree.
- [ ] Hermes pushes `main` and configures Pages source as GitHub Actions if required.
- [ ] Hermes watches the workflow and verifies `https://moolmong.github.io/My_Character/` by HTTP/browser.
- [ ] After verification, Hermes may update README deployment status if it was intentionally left pending.
