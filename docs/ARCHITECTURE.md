# My_Character MVP Architecture

## Technical baseline

- Vite
- React
- TypeScript with strict checking
- Plain CSS
- Inline React SVG for the connection layer
- GitHub Actions and GitHub Pages

No runtime dependencies beyond React are expected. Interaction state and geometry are small enough for React hooks and browser APIs.

## Proposed source layout

```text
.
├── .github/workflows/deploy-pages.yml
├── docs/
├── src/
│   ├── assets/character-v0.png
│   ├── components/
│   │   ├── CharacterStage.tsx
│   │   ├── CharacterVisual.tsx
│   │   ├── ConnectionLine.tsx
│   │   ├── EquipmentHotspot.tsx
│   │   └── EquipmentTooltip.tsx
│   ├── data/equipment.ts
│   ├── hooks/useEquipmentInteraction.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── index.html
├── package.json
├── tsconfig*.json
└── vite.config.ts
```

Exact splitting may be adjusted during implementation if a file would otherwise be trivial, but the data, character visual, hotspot layer, SVG layer, and tooltip layer must remain distinct.

## Layer model

Within one responsive `CharacterStage` coordinate space, layers are ordered as follows:

1. **Character visual:** the replaceable CSS fallback, later replaceable by an `<img>` without changing interaction components.
2. **SVG connection layer:** absolute stage overlay, `pointer-events: none`, `aria-hidden="true"`.
3. **Hotspot layer:** native transparent buttons positioned from percentage hitboxes, above art and line.
4. **Tooltip layer:** desktop side cards or a mobile fixed card, above all stage layers.

The stage owns a stable aspect ratio for the visual coordinate system. Responsive CSS scales the whole coordinate space while keeping percentages aligned. Tooltips are not children of or painted into the asset.

## Equipment data contract

```ts
export type PercentageRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PercentagePoint = {
  x: number;
  y: number;
};

export type EquipmentItem = {
  id: string;
  title: string;
  technology: string;
  description: string;
  hitbox: PercentageRect;
  anchor: PercentagePoint;
  tooltipSide: "left" | "right";
};
```

`equipment.ts` is the only source of item content and coordinate truth. Coordinate values are percentages of the character coordinate wrapper, not viewport pixels and not coordinates embedded in an image. Initial values will be calibrated to the CSS fallback and documented as provisional.

Development-only validation should reject or warn about duplicate IDs, non-finite values, rectangles outside 0–100, and anchors outside 0–100. Hitboxes may overlap visually only when unavoidable; DOM order will follow a predictable top-to-bottom equipment order.

## Character renderer boundary

`CharacterVisual` exposes no interaction logic. For MVP it produces a semantic-free, `aria-hidden` CSS silhouette made from a small number of elements/pseudo-elements representing body, spear, armor, shield, bracer, cloak, and boots. Hotspots are siblings, never nested inside those shapes.

When a transparent final asset arrives:

1. place it under `src/assets/`;
2. change `CharacterVisual` to render the imported image using `object-fit: contain`;
3. preserve the stage aspect ratio or set the wrapper to the new art ratio;
4. edit only `hitbox` and `anchor` percentages in `equipment.ts`;
5. verify all input modes and line endpoints.

The supplied board remains in the repository and can be cited in the README as reference-only Asset v0.

## State and event model

Keep a single active item ID plus activation intent rather than six booleans:

```ts
type ActivationMode = "hover" | "focus" | "pinned" | null;
type EquipmentState = {
  activeId: EquipmentItem["id"] | null;
  mode: ActivationMode;
};
```

- Fine-pointer `pointerenter` sets `hover`; the corresponding leave clears only hover-originated state.
- Focus sets `focus`; blur clears only focus-originated state unless an item was pinned.
- Click, Enter, or Space toggles `pinned` state. Native button keyboard click behavior should be used rather than manually duplicating key semantics unless testing shows a gap.
- Coarse-pointer taps always use pinned behavior.
- A document-level `pointerdown` listener closes pinned state only when the target is outside the stage/card boundary.
- A document-level `keydown` listener handles Escape while an item is active. Store the last pinned trigger ref so focus can be restored when appropriate.
- Listeners are attached and cleaned up through effects; stable callbacks prevent unnecessary reattachment.

Hover capability should be gated by `matchMedia('(hover: hover) and (pointer: fine)')`. CSS media queries control layout; JavaScript capability detection controls hover semantics, not viewport width.

## Tooltip semantics

The hotspot is the primary control. It receives:

- `aria-label`, for example `컨테이너 수호창: Kubernetes / Container 장비 설명`;
- `aria-expanded` reflecting whether that item is active;
- `aria-controls` referencing its stable tooltip content ID.

The detail panel remains a non-modal contextual region; it should not steal focus when opened. Use a labelled region (`role="region"` or an appropriately tested tooltip pattern) rather than `role="dialog"` unless it gains interactive controls. The title labels the region and descriptive text remains available to screen readers. A visible close button may be included for the mobile pinned card, with a clear Korean accessible name.

## Geometry and SVG line

Anchor start coordinates come directly from equipment percentages. The line endpoint must come from rendered geometry rather than hard-coded per-item pixels:

1. Hold refs to the stage and active tooltip.
2. On active item/layout change, read their bounding rectangles.
3. Choose the midpoint of the tooltip edge facing the character.
4. Convert that viewport point into stage-local coordinates.
5. Render a simple line or two-segment polyline in an SVG whose `viewBox` matches the current stage width and height.

Use `ResizeObserver` on the stage and tooltip (with window resize as a conservative fallback) to recompute geometry. On mobile the line may terminate at the top edge of the floating card; if this crosses excessive content at a narrow width, it may be hidden below a documented breakpoint because the card and active hotspot highlight already convey the relationship. The SVG must never intercept input.

## Styling and responsive strategy

- Use CSS custom properties for palette, spacing, borders, and motion timing.
- Use `min-height: 100svh` with a `100vh` fallback and safe block padding rather than a fixed height.
- Stage width uses `min()`/`clamp()` and a stable aspect ratio; reserve side columns on wide screens.
- At the mobile breakpoint, tooltip positioning switches to `position: fixed` with `inset-inline` padding, bottom safe-area allowance, maximum height, and internal overflow if needed.
- Set defensive `max-width: 100%`, `min-width: 0`, and overflow wrapping. Do not globally hide overflow to mask layout bugs.
- Keep animation to transform/opacity/stroke dash properties. Reduced motion sets animation duration near zero and removes idle transforms.

## Page composition

`App` renders a semantic `main` with:

- one labelled hero section containing `CharacterStage`;
- About, Experience, Projects, and Contact sections with headings and neutral placeholder copy.

A skip link is recommended because six hotspot controls precede the supporting content. Heading order starts with one `h1`, then `h2` section headings. Decorative visual elements are hidden from the accessibility tree.

## Build and Pages deployment

- `vite.config.ts` sets `base: "/My_Character/"`.
- Asset imports go through Vite; no absolute root asset paths.
- The workflow triggers on pushes to `main` and supports manual dispatch.
- Set least-privilege permissions: `contents: read`, `pages: write`, `id-token: write`.
- Use the official flow: checkout, setup Node with npm cache, `npm ci`, build, `actions/configure-pages`, `actions/upload-pages-artifact`, and `actions/deploy-pages`.
- Use a `github-pages` environment and deployment URL output. Pin official actions to current stable major versions during implementation after checking their official documentation if needed.
- The workflow creates no repository and changes no Pages settings outside the action. Hermes will push, enable/verify Pages if necessary, and confirm the public URL.

## Verification strategy

- Static checks: TypeScript (`tsc --noEmit` or project build mode) and Vite production build.
- Unit/component tests are optional only if no test runner is added; prefer adding lightweight tests if interaction logic becomes nontrivial, but do not add a large framework solely for coverage optics.
- Manual review matrix: fine pointer, keyboard only, coarse/touch emulation, 320 px width, desktop width, 200% zoom, reduced motion, and no-JavaScript graceful content expectations where reasonable for a Vite SPA.
- Inspect the production build under `/My_Character/` base and ensure asset URLs resolve.

## Key decisions and tradeoffs

- **CSS fallback over supplied board:** preserves a clean hero and honest layer separation; visual fidelity is intentionally limited until final art exists.
- **Percentage data plus measured endpoint:** makes equipment placement asset-relative while allowing tooltips to reflow responsively.
- **One active state:** prevents overlapping cards and reduces contradictory ARIA state.
- **Native buttons:** supplies keyboard activation and focus behavior with less custom event code.
- **No UI/animation library:** the scope does not justify bundle or abstraction cost.
