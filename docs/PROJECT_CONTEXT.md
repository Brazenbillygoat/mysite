# Portfolio project context

Last verified against the repository: 2026-07-27

This file is the durable current-state handoff for future development sessions.
Read it with `AGENTS.md` before proposing or implementing work. If
`docs/ACTIVE_PLAN.md` exists, read it afterward for mutable feature or session
instructions. Current files and repository state take precedence if any
documentation becomes stale.

## Product purpose

This repository contains two intentionally different portfolio experiences:

- The repository root is Hyrum Butler's professional portfolio and the primary
  GitHub Pages landing page.
- `sandbox/` is the preserved playful legacy portfolio, presented as "Hyrum's
  Sandbox."

The professional portfolio is a static, single-page field guide to Hyrum's
software-engineering work. It emphasizes dependable software, systems thinking,
practical problem solving, and craftsmanship. The Sandbox intentionally retains
its separate, playful visual language and interactions.

## Current implementation

Implemented:

- A framework-free professional page in `index.html`.
- One focused professional stylesheet in `styles/portfolio.css`.
- A preserved Sandbox under `sandbox/`, including its HTML, CSS, JavaScript,
  vendor scripts, and images.
- A downloadable resume at `assets/Hyrum-Butler-Resume.pdf`.
- Professional-page favicon and social-preview assets under `assets/`.
- Semantic page regions, a keyboard-visible skip link, responsive layouts,
  visible focus states, reduced-motion handling, and WCAG AA-oriented contrast.
- A sticky desktop header and an intentionally sticky experience-section
  heading that follows part of the scroll before yielding to the next section.
- A desktop two-column hero with editorial contour decoration and a field-record
  summary card.
- Ocean Intelligence as the primary public case study, followed by selected
  production work, experience, engineering approach, about, contact, and a
  Sandbox invitation.

The professional page currently uses no JavaScript. Its behavior comes from
semantic HTML and CSS. Sandbox JavaScript remains scoped to `sandbox/`.

Not implemented:

- A frontend framework, component system, CMS, backend, database,
  authentication, or client-side routing.
- A new deployment system or build-based production pipeline.
- A public hosted Ocean Intelligence application.

Feature-specific refinements and proposed work belong in
`docs/ACTIVE_PLAN.md`, not in this file.

## Repository structure and ownership

Primary professional files:

- `index.html`: professional-page structure, metadata, copy, and links.
- `styles/portfolio.css`: the complete professional visual system and
  responsive behavior.
- `assets/Hyrum-Butler-Resume.pdf`: approved downloadable resume.
- `assets/images/favicon.ico`: professional favicon.
- `assets/og/hyrum-butler-portfolio.png`: social-preview image.

Preserved Sandbox files:

- `sandbox/index.html`
- `sandbox/css/`
- `sandbox/images/`
- `sandbox/src/app.js`
- `sandbox/src/jquery.magnific-popup*.js`

Repository guidance:

- `AGENTS.md`: durable operating rules and project guardrails.
- `docs/PROJECT_CONTEXT.md`: verified current state and decisions.
- `docs/ACTIVE_PLAN.md`: ignored, mutable implementation handoff for the active
  feature or session.

## Professional page composition

The page currently flows through these regions:

1. Sticky site header and section navigation.
2. Hero with headline, supporting copy, availability, actions, contour field,
   and field-record card.
3. Selected work with the Ocean Intelligence case study and recent production
   examples.
4. Experience timeline with a sticky desktop section heading.
5. Engineering approach, principles, and toolkit.
6. About.
7. Contact.
8. Sandbox invitation and footer.

The professional visual identity uses warm off-whites, pine greens, slate blues,
warm neutrals, strong editorial typography, thin rules, restrained contour
references, and mostly square surfaces. Preserve this identity unless the user
explicitly requests a redesign.

The sticky experience heading is an approved subtle interaction. Preserve it
when adjusting desktop composition unless a specific requirement conflicts with
it. Mobile layouts intentionally remove sticky section-heading behavior.

## Hosting and URL behavior

The public site is:

`https://brazenbillygoat.github.io/mysite/`

The repository guidance records that GitHub Pages was last externally verified
on 2026-07-25 as a legacy build from the `master` branch and repository root.
Reverify that external setting before deployment rather than assuming it cannot
change.

GitHub Pages serves this project beneath `/mysite/`, not from a domain root.
Professional and Sandbox links therefore use document-relative URLs.
Root-absolute local URLs would resolve against `brazenbillygoat.github.io/` and
break the project-site path.

There is no GitHub Actions deployment workflow and no production build command.
GitHub Pages serves the repository's source files directly.

## Content and privacy state

- Hyrum is based in the Greater Kansas City Area and is looking for his next
  software-engineering role.
- The professional contact surface uses email, LinkedIn, GitHub, and the
  downloadable resume.
- The resume contains Hyrum's phone number, but the professional-page HTML does
  not repeat it.
- Employment dates and work claims are grounded in the approved resume and
  inspected source material.
- Ocean Intelligence source is public, but the application is not presented as
  publicly deployed. It requires a protected server-side Global Fishing Watch
  token.
- Historical AIS observations must not be described as live vessel locations.

## Tooling and validation

Node.js is used for development checks, not for the production runtime. The
current package scripts are:

- `npm.cmd run lint`: lint `sandbox/src/app.js`.
- `npm.cmd run format:check`: verify formatting for included first-party files.
- `npm.cmd run format`: write formatting and therefore requires explicit
  authorization.
- `npm.cmd run dev`: launch Vite for local viewing and therefore must not be run
  unless the user explicitly authorizes a preview workflow.

Normal verification:

```powershell
npm.cmd run lint
npm.cmd run format:check
git diff --check
git status --short --branch
git diff --stat
git diff
```

The preserved Sandbox and generated lockfile are excluded from broad formatting
to avoid behavior-obscuring churn. There is no production build command to
validate.

The user owns browser, responsive, and visual review. Automated checks do not
constitute visual verification.

## Important current decisions

- Keep the professional page framework-free until a demonstrated requirement
  justifies a change.
- Keep professional and Sandbox assets, dependencies, and visual languages
  separate.
- Preserve the Sandbox rather than redesigning or broadly reformatting it.
- Prefer native HTML and CSS over JavaScript for professional-page behavior.
- Preserve accessibility behavior while refining visual composition.
- Use desktop-specific composition when useful without weakening the strong
  mobile experience.
- Keep subtle editorial interactions restrained and non-distracting.
- Add comments for non-obvious accessibility, responsive, positioning, overlap,
  or project-path decisions. Do not comment obvious syntax.
- Do not introduce a new hosting or deployment system as part of ordinary
  portfolio refinement.

## Related repository

Ocean Intelligence is maintained separately at:

`https://github.com/Brazenbillygoat/ocean-intelligence`

Its local checkout may exist at
`C:\Users\hyrum\repos\ocean-intelligence`. Treat that repository as read-only
from portfolio sessions unless the user explicitly authorizes changes there.
Use its current code, tests, `AGENTS.md`, and `docs/PROJECT_CONTEXT.md` when
verifying case-study claims.
