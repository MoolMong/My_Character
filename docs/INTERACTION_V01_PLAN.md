# Interaction v0.1 implementation plan

> 상태 메모 (2026-08-14): 이 문서는 두 frame motion 실험 전 작성된 역사적 계획입니다. 현재 runtime은 품질 안정성을 위해 portrait A만 고정 렌더링하며 창·방패·장갑·신발 네 hotspot을 제공합니다. `README.md`가 현행 동작을 설명합니다.

## Pass boundary

This plan was approved for implementation. Runtime changes follow the structure
below; Codex does not commit, push, or deploy.

## Current structure

- The application is Vite + React 19 + strict TypeScript + plain CSS. `App.tsx`
  keeps a character-centered hero above the existing About, Experience, Projects,
  and Contact sections.
- `CharacterStage.tsx` owns the single active equipment ID, hover/focus/pinned
  intent, outside-click and Escape dismissal, tooltip geometry, the SVG connection
  line, and the independent "장비 설명 모두 보기" toggle.
- `CharacterVisual.tsx` is the isolated artwork boundary and currently renders the
  1122×1402 labelled `character-v1.png` board.
- `equipment.ts` is the content and percentage-coordinate source for the six
  existing board controls. `EquipmentHotspot`, `EquipmentTooltip`,
  `EquipmentList`, and `ConnectionLine` are already separate layers/components.
- The stage uses a stable 1122:1402 aspect ratio; percentage rectangles and anchors
  therefore stay aligned as it scales. Below 700 px the SVG line is hidden and the
  tooltip becomes a fixed, safe-area-aware card.
- Vitest/Testing Library currently covers click, keyboard, Escape, outside click,
  the six-item all-explanations toggle, ARIA relationships, and basic mobile panel
  structure. Data tests validate unique IDs and bounded percentage coordinates.

## Supplied asset inspection

The source images and the staged reference copies are byte-identical in pairs:

| Neutral config ID | Source | Staged reference | Dimensions | Observed content |
| --- | --- | --- | --- | --- |
| `portrait-a` | `img_8f0d225f089c.png` | `character-gloves-v01.png` | 1024×1536 | Full-body front-facing pixel knight with shield and spear |
| `portrait-b` | `img_fe66a96eeac2.png` | `character-shoes-v01.png` | 1024×1536 | Closely related full-body front-facing pixel knight pose |

Both PNGs report 8-bit RGB color (PNG color type 2), not RGBA. The light/off-white
background seen in inspection is baked into the image; it must not be described or
implemented as transparent. The staged filenames are not sufficient evidence that
one pose semantically means gloves and the other shoes, and visual inspection does
not establish that mapping confidently. Runtime data will therefore use neutral
`portrait-a` / `portrait-b` IDs and keep labels/configuration easy to rename.

## Proposed integration and state mapping

Preserve the existing labelled board and all six of its interactions as an explicit
`equipment-board` visual configuration. Add the two supplied portraits as two more
selectable visual configurations in the same hero rather than replacing the board
or redesigning the page. A compact native-button state switcher near the stage will
select `equipment-board`, `portrait-a`, or `portrait-b`; it will expose pressed state
and a clear accessible group label. The default should remain `equipment-board` for
the least regression risk unless Hermes requests a portrait-first default during
plan review.

Each visual configuration will define:

- imported artwork, intrinsic aspect ratio, and neutral UI label;
- its own ordered equipment IDs;
- per-item percentage hitbox and anchor geometry;
- any presentation class needed for the baked background, without changing the
  site palette globally.

`equipment-board` continues to reference the existing six records and coordinates.
Each portrait references `gloves` and `shoes` records. Switching configurations
will close any active tooltip so stale controls, lines, and `aria-controls` state do
not survive onto unrelated artwork. The all-explanations toggle remains independent:
its existing six board cards stay available and retain their current state when a
portrait is selected. Portrait glove/shoe details will be appended to that same
data-driven panel only if review confirms "all" should literally include the new
items; otherwise the button label and six-item behavior remain unchanged to avoid
silently changing the existing feature.

## Data and editable copy

Keep presentation components free of glove/shoe copy. Extend/refine the data layer
so shared content and image-specific coordinates are explicit, for example:

```ts
const characterEquipment = {
  gloves: {
    title: "장갑",
    technology: "편집 가능한 설명",
    description: "설명 준비 중 — 이 문구를 교체하세요.",
  },
  shoes: {
    title: "신발",
    technology: "편집 가능한 설명",
    description: "설명 준비 중 — 이 문구를 교체하세요.",
  },
};
```

The implementation will place this text in `src/data/equipment.ts` (or a narrowly
named adjacent character-config data file if that keeps the existing six-item API
clean). A comment immediately above the records will state that this is the exact
edit location. No biography, product benefit, material, technology, or user fact
will be invented.

## Coordinate strategy

- Use the full 1024×1536 image canvas as the stable coordinate system for both
  portraits. The stage aspect ratio changes with the selected config, and image,
  hotspot layer, and connection layer share that exact box.
- Store every rectangle and anchor as percentages in the selected image config;
  do not use viewport pixels or one shared portrait map merely because the poses
  are similar.
- Initial calibration will be made from the actual rendered pixels. Based on visual
  inspection, glove regions are around the lower forearms/hands near x 29–40% and
  62–72%, y 42–59%; shoes are around x 32–48% and 54–69%, y 74–88%. These are
  planning ranges only, not final coordinates. Implementation will inspect each
  pose separately and set bounded combined or paired hit areas that meet a usable
  touch target without covering the torso, weapon, shield, or most of the legs.
- One equipment concept may use multiple transparent native buttons (left/right
  glove and left/right shoe) sharing one content ID. This produces more accurate
  irregular coverage than one large rectangle while retaining a single selected
  item. Accessible labels will distinguish left/right only if doing so helps rather
  than presenting duplicate controls; otherwise one carefully bounded rectangle
  per concept will be used.
- The existing anchor/tooltip line will use the selected config's anchor. CSS motion
  must wrap the image and its hotspot/line layers together, or be limited to an
  inner visual that does not make stationary hotspots drift away from the artwork.
  The preferred implementation is a shared inner scene wrapper so alignment is
  invariant throughout the idle transform.

## Motion and feedback

- Add one slow CSS keyframe to the portrait scene wrapper using only `transform`,
  approximately a 1–2 px vertical drift at rendered desktop size and at most about
  0.2–0.4% scale variation. Use an eased multi-step cycle of roughly 5–7 seconds so
  the loop boundary is not perceptible. Do not add a JavaScript animation loop.
- Keep the board static unless the shared-wrapper implementation can animate it
  without making its embedded labels harder to read.
- Use `transform-origin` near bottom center so feet remain visually grounded. Avoid
  rotation, bounce, and independent hotspot motion.
- `prefers-reduced-motion: reduce` will remove the idle transform and continue to
  minimize tooltip/line transitions using the existing policy.
- Retain native pointer/keyboard behavior. Replace the visually loud full dashed
  rectangle for portrait items with a restrained translucent localized glow/outline
  on hover, focus, and selected state; keep a visible non-color-only focus ring.
  Coarse pointer devices receive tap/pinned behavior without hover dependence.

## Expected implementation touch points

- `src/assets/`: promote/copy both reviewed references to clearly neutral live asset
  names while leaving the staged backup/reference files intact.
- `src/data/equipment.ts` and possibly `src/data/characterConfigs.ts`: add placeholder
  content, per-config aspect ratios, and separate percentage maps with validation.
- `src/components/CharacterStage.tsx`: own selected visual config, derive visible
  hotspots, reset stale active state, and preserve the existing all-toggle logic.
- `src/components/CharacterVisual.tsx`: accept/render the selected artwork while
  remaining interaction-free.
- `src/components/EquipmentHotspot.tsx`: support config-derived geometry and subtle
  variant styling without abandoning native buttons or ARIA relationships.
- `src/styles.css`: responsive 2:3 portrait stage sizing, scene idle animation,
  selector and selected feedback, mobile portrait/landscape bounds, and reduced
  motion.
- Focused component/data tests: state switching, two glove/shoe controls per portrait
  config as chosen, placeholder content, reset behavior, valid independent maps,
  existing six controls/all-toggle, and accessibility state.

No unrelated content sections, deployment workflow, dependencies, or global visual
system should change.

## Risks and mitigations

- **Opaque light background against the dark hero:** use contained framing and the
  existing border/shadow vocabulary; do not attempt destructive background removal
  or claim transparency. Confirm the result visually at all target sizes.
- **Existing board and portrait aspect ratios differ:** derive aspect ratio from the
  active config and constrain height as well as width so a 2:3 image does not force
  horizontal or vertical overflow, especially in landscape.
- **Hotspots drifting during breathing:** animate a shared scene containing artwork
  and overlays, then test at multiple animation phases; never animate only the PNG.
- **Similar images being mislabeled:** keep neutral IDs/labels and independent maps;
  do not infer equipment state from backup filenames.
- **Duplicate controls or stale ARIA links after switching:** render only the active
  config's hotspots and close/reset active details before/while changing config.
- **Touch areas too small or overly broad:** calibrate against actual pixels, use
  separate left/right rectangles if necessary, and visually inspect at 320/390 px.
- **Tooltip covering the selected body area on narrow screens:** retain the mobile
  bottom card, bounded height, internal scrolling, safe-area insets, and hidden SVG
  line below 700 px.
- **Regression in the six existing interactions:** keep their records/config intact
  and rerun all current behavior tests in addition to new config tests.

## Test and review plan

Automated checks after implementation:

1. `npm run typecheck`
2. `npm test`
3. `npm run build`
4. Confirm the production bundle uses the configured GitHub Pages base path and
   emits both new image assets without missing-path errors.

Focused automated coverage will verify:

- all three visual configs render the expected image/control set and use bounded,
  independently validated coordinates;
- selecting glove/shoe opens the matching placeholder region, switches selection,
  toggles closed, and maintains accurate `aria-expanded` / `aria-controls`;
- config switching clears a pinned/hover/focus detail and does not duplicate IDs;
- Enter/Space, Escape with focus restoration, pointer click, outside click, and
  the existing six-card all-toggle still work;
- placeholder copy remains data-driven and clearly marked;
- the current six equipment records remain valid and reachable.

Manual browser/preview review will cover:

- desktop fine-pointer hover/click and keyboard-only navigation;
- mobile/coarse tap at 320×568 and 390×844 portrait sizes;
- representative phone landscape sizes such as 844×390, checking both axes for
  overflow and ensuring the character and switcher remain usable;
- resize between desktop/mobile and between configs, confirming hotspots remain on
  both gloves/shoes and line endpoints recalculate;
- actual idle motion at multiple points in the cycle, reduced-motion emulation,
  focus visibility, tooltip close behavior, and no console errors;
- visual treatment of the baked light background within the existing dark hero;
- existing board hotspots, tooltip/list toggle, downstream sections, and scroll/skip
  navigation for regressions.

After tests, Codex will perform a separate code/UX/accessibility review pass, fix
in-scope findings, and report any coordinates that still merit manual art-direction
tuning. Commit, push, final Git verification, and deployment remain Hermes-owned.
