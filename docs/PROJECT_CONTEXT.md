# Portfolio project context

Last reviewed against the repository: 2026-08-29

## Purpose and current product

The repository contains two separate experiences:

- The root is Hyrum Butler's professional, static single-page portfolio.
- `sandbox/` preserves the playful legacy portfolio and its existing stack.

The professional site presents software-engineering experience, systems
thinking, practical problem solving, and craftsmanship. It is framework-free:
`index.html`, `styles/portfolio.css`, and narrowly scoped JavaScript provide the
experience. There is no backend, CMS, database, authentication, router, or
production build pipeline.

## Current professional experience

- A responsive field-guide visual system with light and dark themes, semantic
  regions, keyboard-visible focus, reduced-motion behavior, and practical
  mobile layouts.
- A desktop hero and work narrative grounded in the approved resume.
- Ocean Intelligence as the primary public case study, with search context and
  vessel-research screenshots, historical-AIS caveats, and Global Fishing
  Watch attribution.
- Warple as a quieter secondary case study with accurate browser, Phaser, Tauri,
  profile-security, delivery, and upstream-artwork boundaries.
- Experience, engineering approach, about, contact, resume download, and a
  deliberate transition to the Sandbox.
- A restrained Ocean visual enhancement in `scripts/ocean-visual.js`: a
  one-shot wide-screen entrance and scanner plus a dedicated negative-space
  rail containing 7 deterministic hollow bubbles and 2 one-shot sonar pings.
  Fine-pointer repulsion is scoped to that rail. Narrow, reduced-motion,
  no-JavaScript, and unsupported-observer cases receive the static composition.

The professional theme controller validates stored `light` and `dark` choices,
applies a valid choice before CSS loads, and falls back to
`prefers-color-scheme`. Sandbox code and dependencies remain under `sandbox/`.

## Key boundaries

- Keep professional and Sandbox assets, dependencies, visual language, and
  formatting separate.
- Preserve the Sandbox rather than redesigning or broadly normalizing it.
- Keep the professional page framework-free until a real requirement changes
  that decision.
- Use native HTML and CSS before JavaScript. The Ocean entrance and ambient
  rail are approved, tightly scoped exceptions, not permission for similar
  effects elsewhere.
- Keep contact information to email, LinkedIn, GitHub, and the approved resume.
  The resume may contain a phone number; page HTML does not repeat it.
- Claims must match the approved resume or inspected source repositories.
  Ocean Intelligence is public source, not a publicly hosted application, and
  historical AIS observations are not live positions.

## Hosting

The public URL is `https://brazenbillygoat.github.io/mysite/`. GitHub Pages was
last externally verified on 2026-07-25 as serving `master` from the repository
root. Reverify before deployment.

Because the site is under `/mysite/`, local navigation and assets use
document-relative URLs. Root-absolute local URLs are invalid for this hosting
model. There is no GitHub Actions deployment workflow.

## Repository ownership

- `index.html`: professional structure, copy, metadata, links, and small theme
  bootstrap.
- `styles/portfolio.css`: professional visual and responsive system.
- `scripts/ocean-visual.js`: scoped Ocean progressive enhancement.
- `assets/`: approved resume, favicon, social preview, and Ocean screenshots.
- `sandbox/`: preserved legacy experience, including vendored scripts.
- `AGENTS.md`: operating and product rules.
- `docs/PROJECT_CONTEXT.md`: durable current facts.
- `docs/ACTIVE_PLAN.md`: only active work, if one exists.

## Validation state

The current Ocean composition and ambient rail passed their documented lint,
focused formatting, JavaScript syntax, link, scope, and asset checks in August
2026, and Hyrum completed browser review. Source review on 2026-08-29 confirmed
the current 7-bubble and 2-ping implementation. This documentation cleanup did
not rerun application checks or browser review.

Normal repository verification is `npm.cmd run lint`,
`npm.cmd run format:check`, `git diff --check`, and full diff inspection. The
Sandbox and generated lockfile remain excluded from broad formatting, and no
production build command exists.
