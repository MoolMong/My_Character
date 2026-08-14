# My_Character MVP Constraints

## Pass boundary

This repository is being handled in three explicit passes:

1. Planning: inspect inputs and write the four documents in `docs/` only.
2. Implementation: follow `docs/TASKS.md`; create the application and deployment workflow, but do not commit or push.
3. Review: perform recruiter, UX, accessibility, and engineering reviews; fix issues and run validation, but do not commit or push.

The current pass is planning only. No package manifest, application source, generated lockfile, workflow, or README is created or modified in this pass.

## Repository ownership and Git safety

- The workspace is an empty Git repository on `main`; pre-existing untracked files belong to the user/input process.
- Codex must not create the GitHub repository, commit, push, merge, force-push, rewrite history, or delete the repository.
- `MoolMong/My_Character` does not currently exist. Hermes will create the public repository and manage Git and Pages verification.
- Do not claim that GitHub Pages is deployed or reachable before Hermes verifies it after push.
- Avoid destructive cleanup commands and preserve unrelated or supplied files.

## Technology constraints

- Required: Vite, React, TypeScript, plain CSS, SVG overlay, GitHub Actions, GitHub Pages.
- Vite base path must be `/My_Character/`.
- Do not add Docker.
- Do not add an unnecessary UI framework, state library, animation library, CSS-in-JS system, backend, database, or cloud infrastructure.
- Use Node 22 and npm. Commit policy is owned by Hermes, but implementation should produce a deterministic npm lockfile suitable for `npm ci`.
- 21st MCP availability/key is unconfirmed; it must not block progress.
- Stitch MCP is unavailable; do not install an unofficial fallback.

## Asset and intellectual-property constraints

- `src/assets/character-v1.png` is the current supplied 1122×1402 hero board; `character-v0.png` is retained unchanged as an earlier reference.
- The current board has embedded character, copy, panels, icons, and lines—not a transparent cutout.
- Do not treat embedded panels/labels as the only accessible page content: keep all six native controls and independent text descriptions.
- Keep asset rendering isolated in `CharacterVisual`; keep hitboxes, equipment content, lines, and tooltips in their existing independent layers.
- Do not download fonts, icons, logos, art, or other third-party assets.
- Do not place large Kubernetes, AWS, Python, Linux, or other technology logos on equipment.
- Future art replacement must be localized to the character renderer plus coordinate recalibration.

## Data and privacy constraints

- Do not add secrets, tokens, API keys, environment credentials, private infrastructure details, employer/company details, or personal data.
- Do not invent experience, metrics, clients, certifications, dates, projects, email addresses, social profiles, résumé links, or contact endpoints.
- Placeholder copy must be clearly generic and professionally readable.
- No unverified contact link may be clickable.
- No analytics, tracking pixels, remote embeds, or external network dependencies are needed.

## UX constraints

- The first screen is approximately one viewport and character-centered; it must remain content-safe rather than rigidly clipped to exactly 100vh.
- Show no permanent set of six explanation panels. Only one item card may be active.
- Six required equipment mappings are fixed: spear/Kubernetes-Container, armor/OpenStack, shield/AWS, bracer/Python, cloak/Terraform-IaC, boots/Linux.
- Desktop supports hover and keyboard. Mobile supports tap with a pinned/fixed card. Outside pointer interaction and Escape close pinned content.
- Hitboxes, anchors, SVG lines, tooltips, and visual art are separate, data-driven layers.
- Hitbox and anchor coordinates use percentages of a stable character coordinate space.
- SVG connection overlays use `pointer-events: none`.
- Mobile must not overflow horizontally; cards remain within viewport/safe areas.
- Animations remain restrained, approximately 200–400 ms, and never block comprehension.

## Accessibility constraints

- Hotspots are native buttons, not image maps, arbitrary divs, or CSS-only hover targets.
- All equipment is operable by Tab, Enter, and Space.
- Controls have equipment-specific accessible names, visible focus indicators, and accurate expanded state.
- Escape dismissal and sensible focus restoration are required.
- Touch and keyboard content is equivalent to hover content.
- Reduced-motion preferences disable the idle loop and minimize line/card motion.
- Color alone cannot communicate active/focus state.
- Decorative CSS art and SVG lines remain outside the accessibility tree.
- Responsive behavior must tolerate zoom and text resizing without content loss.

## Deployment constraints

- Add a workflow for `main` pushes using official GitHub Pages actions only.
- Use least-privilege workflow permissions and `npm ci` against the checked-in lockfile.
- Do not deploy to AWS, provision paid resources, add custom-domain configuration, or store deployment secrets.
- README may state the expected live URL `https://moolmong.github.io/My_Character/`, but must label deployment as pending Hermes verification until verified.

## Quality constraints

- Implementation must pass dependency installation, TypeScript checking, and production build.
- Test scripts must not be claimed if no test runner is configured.
- The review pass must inspect recruiter clarity, UX behavior, keyboard/screen-reader semantics, reduced motion, responsive overflow, code organization, and Pages base-path correctness.
- Any deviation from `docs/TASKS.md` should be documented rather than silently weakening a requirement.
