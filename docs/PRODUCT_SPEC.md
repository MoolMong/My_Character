# My_Character MVP Product Specification

## Product goal

Build a public-facing, character-centered portfolio MVP for an infrastructure/cloud engineer. The first screen should feel like a restrained pixel-art RPG character inspection screen: visitors discover six engineering strengths by interacting with equipment on the character. The MVP validates the interaction model, accessibility, responsive behavior, and deployment pipeline; it is not a finished personal portfolio or final illustration.

## Audience and value

- Primary audience: recruiters and engineering hiring managers scanning for role, technical range, and communication clarity.
- Secondary audience: peers viewing the interaction on desktop or mobile.
- Visitor outcome: understand within seconds that the subject is an infrastructure/cloud engineer, then inspect six clearly explained competencies without needing to decode logos.

## Experience principles

1. The character is the visual focus; permanent interface chrome stays sparse.
2. Interaction is discoverable but never hover-only.
3. Technology is conveyed through item names and readable copy, not third-party logos.
4. The composition remains calm: subtle motion, one equipment detail at a time, and generous space.
5. Temporary art, coordinates, copy, and interaction rendering remain independently replaceable.

## Hero experience

The hero occupies approximately one viewport (`min-height: 100svh`, with content-safe padding) and contains:

- Eyebrow/role: `Infrastructure / Cloud Engineer`.
- A short, non-identifying Korean introduction such as `운영을 이해하고 자동화로 개선하는 인프라 엔지니어입니다.`
- A centered character rendering.
- A concise instruction that changes by input context where practical: hover/focus on desktop and tap on touch devices. It must not be the only way to understand the controls.
- Six transparent, focusable equipment buttons positioned over the character coordinate space.
- At most one visible equipment tooltip and connection line.

The character may use a gentle 1–2 px vertical idle movement. All essential content remains usable when animation is disabled.

## Equipment content

| ID | Item name | Technology | MVP description | Preferred side |
| --- | --- | --- | --- | --- |
| `container-spear` | 컨테이너 수호창 | Kubernetes / Container | 컨테이너 기반 서비스의 운영과 배포를 다룹니다. | left |
| `private-armor` | 프라이빗 철갑 | OpenStack | OpenStack 기반 프라이빗 클라우드 환경을 운영해왔습니다. | right |
| `cloud-shield` | 구름 기사의 방패 | AWS | 퍼블릭 클라우드 환경을 익히고 확장하고 있습니다. | right |
| `python-bracer` | 닳고닳은 파이썬 손목보호대 | Python | 반복되는 운영 작업을 Python으로 자동화합니다. | left |
| `architect-cloak` | 설계자의 망토 | Terraform / IaC | 인프라를 코드로 정의하고 표준화하는 방식을 익히고 있습니다. | right |
| `linux-boots` | 리눅스 여행 부츠 | Linux | 서버와 인프라를 다루는 가장 오래된 기본기입니다. | left |

Copy is deliberately generic and must not invent employers, tenure, project outcomes, certifications, or personal contact details.

## Interaction requirements

### Desktop and fine pointer

- Pointer entering a hotspot activates its item.
- Moving directly between the hotspot and its associated presentation should not cause distracting flicker; dismissal may use a short CSS transition or coordinated state handling.
- Pointer leaving the interactive area dismisses hover-originated state.
- Focus activates the item so keyboard users receive equivalent information.
- Enter or Space toggles/pins the focused item.
- Escape closes the active item and returns focus to its hotspot when closure originated from a pinned/open control.

### Touch and coarse pointer

- Tapping a hotspot opens and pins its item in a fixed/floating card near the bottom of the viewport.
- Tapping another hotspot switches the card.
- Tapping outside the character interaction/card or pressing Escape closes it.
- Tapping within the card does not trigger outside dismissal.

Pointer Events should provide the shared input foundation. Hover behavior must only be enabled for hover-capable devices so synthetic mobile hover does not trap the interface.

## Tooltip and connection behavior

- Desktop tooltips occupy reserved left/right stage space according to `tooltipSide`, with responsive clamping if space is limited.
- Mobile uses one viewport-safe bottom/floating card; no attempt is made to attach a narrow card directly beside an equipment pixel.
- Tooltip content includes item name, technology, and description. Decorative framing is hidden from assistive technology.
- A stage-sized SVG with `pointer-events: none` draws only the active connection from the equipment anchor to a computed tooltip-edge endpoint.
- The line may draw over 200–400 ms. Reduced-motion mode shows it without drawing animation.

## Supporting sections

Below the hero, provide lightweight semantic placeholders for:

- About
- Experience
- Projects
- Contact

These sections should establish future page structure without fabricated claims or unverified links. Contact may state that details will be added later; it must not include guessed email or social URLs.

## Visual direction

- Warm, low-contrast paper/dusk palette with dark navy/brown outlines and a small blue/gold accent range.
- Crisp borders, small stepped shadows, and system/local font stacks; no external font or icon requests.
- Pixel flavor comes from geometry, color, borders, and optional CSS `image-rendering`, not heavy animation or excessive panels.
- Equipment controls need a visible focus indicator and a subtle active highlight that is perceivable without relying on color alone.

## Responsive and accessibility acceptance criteria

- No horizontal page overflow at 320 CSS px width.
- Hero remains readable with browser zoom and increased text size; it may become taller than one viewport rather than clipping content.
- All six items are reachable in a logical Tab order and represented by native buttons.
- Each button exposes an equipment-specific `aria-label` and accurate `aria-expanded` state.
- The active description has a stable labelled relationship to its trigger (`aria-controls` and a labelled tooltip/dialog region as appropriate).
- Enter, Space, Escape, focus, pointer hover, tap switching, and outside dismissal work as specified.
- Focus is not lost when content closes.
- Text and meaningful controls meet WCAG AA contrast targets; focus indication is clearly visible.
- `prefers-reduced-motion: reduce` disables idle movement and removes/minimizes line and card transitions.
- Content remains meaningful if the SVG line or decorative character art is unavailable.

## Asset decision

`src/assets/character-v0.png` is a 1122×1402 illustrated reference board, not a transparent character cutout. It contains its own headings, Korean descriptions, item panels, connector lines, inventory, and contact icons. Cropping its center would still retain a textured background and risks clipping the spear, cloak, or boots; using the entire board would compete with and duplicate the new accessible interface.

For this MVP, retain the supplied file unchanged as a design reference but do not render it as the hero. Render a clean CSS fallback character/silhouette inside a dedicated character visual component. The fallback will have approximate RPG equipment shapes sufficient to orient the six percentage-based hotspots, without logos or third-party art. Later replacement requires changing only the character visual source and recalibrating coordinate data.

## Out of scope

- Final character illustration, image extraction, or AI-generated replacement art.
- CMS, backend, authentication, analytics, forms, email delivery, or databases.
- Real career history, project case studies, personal links, downloadable résumé, or localization framework.
- Docker, cloud infrastructure, paid services, or runtime secrets.
- Multi-item comparison panels, sound, complex animation libraries, or a UI framework.
- Creating the GitHub repository, committing, pushing, enabling Pages, or claiming a live deployment. Hermes owns those operations.

## Definition of done for the complete MVP

The implementation matches the interactions and accessibility requirements above; all equipment is data-driven; art, hitboxes, lines, and tooltips are separate layers; the four placeholder sections exist; production build and TypeScript checks pass; and an official GitHub Pages workflow is ready for Hermes to push and verify.
