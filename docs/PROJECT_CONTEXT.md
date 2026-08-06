# Portfolio project context

Last verified against the repository: 2026-08-06

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
- The approved 2026 resume at `assets/Hyrum-Butler-Resume.pdf`.
- Professional-page favicon and social-preview assets under `assets/`.
- System-preference light and dark themes on the professional page, with a
  persisted manual header toggle that uses `data-theme` for explicit choices.
- Semantic page regions, a keyboard-visible skip link, responsive layouts,
  visible focus states, reduced-motion handling, and WCAG AA-oriented contrast.
- A sticky desktop header and an intentionally sticky experience-section
  heading that follows part of the scroll before yielding to the next section.
- A desktop two-column hero that leads with 5+ years of enterprise full-stack
  work across .NET and React, with editorial contour decoration and a
  field-record summary card. At wide-desktop widths, the right rail also
  includes a restrained engineering-focus list.
- Ocean Intelligence as the primary public case study, with scannable evidence
  for its API boundaries, protected upstream access, reliability controls, and
  test coverage.
- Warple as a quieter, text-led secondary public case study covering its
  browser, game-engine, and native responsibilities; data-only profile security
  boundary; delivery evidence; and WindowPet and Blooky attribution.
- Selected production work, experience, engineering approach, about, contact,
  and a Sandbox invitation after the public case studies.
- A desktop-specific composition pass with tighter structural spacing, a
  hero-to-work survey line, a contained sticky Ocean Intelligence field note,
  and a subtle project-link contour response.
- A two-screenshot Ocean Intelligence research-view composition: screenshot 2
  provides search/results context and the dominant organized vessel research
  view uses the approved `915x900` capture of filtered results and the JUST
  HANGIN' dossier. Global Fishing Watch attribution and the historical AIS caveat
  remain visible in both the research image and real caption text. The
  overlapping two-panel view begins at `70rem`; narrower layouts stack the
  screenshots for readability. The wide composition gives screenshot 3 a clearer
  38/62 visual emphasis with a restrained `3rem` overlap.
- A narrow, one-shot desktop-only entrance for the Ocean composition is the only
  new professional-page motion behavior. It triggers from the screenshot stage
  at `70rem` and above with larger opposing frame movement (search context
  entering left/down, dossier entering from the right) and a single vertical
  thin lime scanner that crosses left to right once. Mobile, reduced-motion,
  unavailable-JavaScript, and unsupported-`IntersectionObserver` cases show the
  completed static composition with no entrance.
- A user-approved Ocean-specific decorative and pointer interaction scoped to a
  dedicated negative-space rail beside the Ocean caption: exactly 7 deterministic
  hollow observation bubbles and 2 staggered one-shot lime sonar pings, all
  generated inside the rail so no circle, bubble, or ping appears over the
  screenshots, caption, headings, evidence, or request-flow strip. Nearby bubbles
  repel from a fine pointer and ease back to fixed home positions when the pointer
  leaves, with no idle animation, recursive frame loop, or custom cursor. The rail
  exists at `70rem` and above when reduced motion is not requested and
  `IntersectionObserver` is available. Wide coarse-pointer devices receive the
  static rail without pointer listeners; fine-pointer repulsion is enabled only
  when hover and fine-pointer queries match. Reduced-motion, unavailable-JavaScript,
  unsupported-observer, and narrow-layout output remain unchanged.
- Scoped dark-surface refinements: slightly lighter Ocean body copy, marginally
  larger small text, a restrained stronger border and shadow on the dominant
  research screenshot, and a one-pixel lime scanner that still sweeps once and
  fades. The old card-wide concentric ring behind the featured-project intro has
  been removed; all Ocean circles now live inside the ambient rail.

The professional page uses one small inline theme controller in `index.html`.
It validates stored `light` and `dark` choices, applies a valid choice before
the stylesheet loads, synchronizes the header toggle, and safely tolerates
unavailable storage. With JavaScript unavailable or no manual choice stored,
CSS follows `prefers-color-scheme`. Sandbox JavaScript remains scoped to
`sandbox/`.

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
- `assets/images/ocean-intelligence-search-results.png`: Ocean Intelligence
  search/results context screenshot (screenshot 2).
- `assets/images/ocean-intelligence-research-view.png`: Ocean Intelligence
  organized vessel research screenshot (the approved `915x900` JUST HANGIN'
  capture and dominant visual).
- `scripts/ocean-visual.js`: scoped progressive-enhancement controller for the
  Ocean composition's one-shot desktop entrance and the optional ambient rail of
  hollow observation bubbles, fine-pointer repulsion, and one-shot sonar pings. The
  rail, bubbles, and pings are generated in JavaScript at runtime; they are not
  committed assets and never appear when JavaScript is unavailable.

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
3. Selected work with Ocean Intelligence as the primary public case study,
   Warple as the secondary public case study, and recent production examples.
   The Ocean case study now includes a two-screenshot research-view composition
   (search/results context leading into the organized vessel dossier) with a
   narrow one-shot desktop entrance.
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

Desktop composition uses two explicit tiers: general desktop begins at
`56.0625rem`, and wide-desktop enhancements begin at `75rem`. The Ocean
Intelligence overlapping two-panel composition is a `70rem` Ocean-specific
tier, separate from those general breakpoints; below it the screenshots stack.
The sticky Ocean Intelligence field note is contained by the featured-project
wrapper so it releases before the Warple case study. These enhancements remain
absent from the approved mobile composition.

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

The portfolio credibility and evidence pass completed automated verification
on 2026-08-03. Lint, focused Prettier checks for the changed text files,
`git diff --check`, static HTML structure and local-link checks, public source
link checks, theme and responsive-rule checks, color-contrast calculations, and
binary PDF verification passed. Repository-wide formatting still reports
pre-existing out-of-scope files separately.

The Ocean Intelligence research-view slice completed automated verification on
2026-08-05, with a follow-up emphasis iteration and a pointer-particle iteration
verified the same day. Lint, focused Prettier checks for the changed text files,
`node --check` and a browser-global-aware ESLint pass for
`scripts/ocean-visual.js`, `git diff --check`, SHA-256 checks for the two
screenshots, and scope checks passed. The emphasis iteration moved the
overlapping two-panel composition to `70rem`, applied the 38/62 wide hierarchy,
strengthened the opposing frame entrance, and replaced the horizontal line with
a single vertical cyan scanner. The particle iteration added the deterministic
18-particle decorative field and the fine-pointer repulsion behavior with dynamic
eligibility teardown. Repository-wide formatting still reports pre-existing
out-of-scope files (`AGENTS.md`, `package.json`) separately. Hyrum approved the
particle interaction in browser on 2026-08-05, then separately approved the
updated JUST HANGIN' research-view screenshot.

The Ocean Intelligence visual-polish slice completed automated verification on
2026-08-06. It moved all decorative bubbles and sonar pings into a dedicated
negative-space rail beside the caption, retuned the scanner to a one-pixel lime
beam, added two staggered one-shot lime sonar pings, slightly improved small-copy
readability on the dark Ocean surface, and strengthened the dominant research
screenshot's border and shadow. Lint, focused Prettier checks for the changed text
files, `node --check` and a browser-global-aware ESLint pass for
`scripts/ocean-visual.js`, `git diff --check`, and SHA-256 checks for the two
screenshots passed. Repository-wide formatting still reports pre-existing
out-of-scope files separately. Hyrum approved browser visual review on 2026-08-06.

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
- Preserve CSS-only system theming when JavaScript is unavailable, and use
  `data-theme` only for a visitor's explicit light or dark choice.
- Use desktop-specific composition when useful without weakening the strong
  mobile experience.
- Keep subtle editorial interactions restrained and non-distracting.
- Add comments for non-obvious accessibility, responsive, positioning, overlap,
  or project-path decisions. Do not comment obvious syntax.
- The Ocean Intelligence screenshot composition may use one narrow, one-shot
  desktop entrance as an approved exception to the general no reveal-on-scroll
  rule; the entrance and the overlapping two-panel layout apply only at `70rem`
  and above, and every fallback shows the completed static composition.
- A user-approved Ocean-specific decorative and pointer exception allows the
  deterministic ambient rail's hollow bubbles, one-shot sonar pings, and
  fine-pointer repulsion in the caption-row negative space only. No circle,
  bubble, or ping may appear over screenshots, text, headings, evidence, or the
  request-flow strip. It does not authorize novelty pointer effects elsewhere on
  the professional portfolio, and `AGENTS.md` remains the default guardrail
  outside this exact feature.
- The old card-wide concentric ring behind the featured-project intro has been
  removed. All Ocean circles now live inside the dedicated ambient rail.
- Do not introduce a new hosting or deployment system as part of ordinary
  portfolio refinement.

## Related repositories

Ocean Intelligence is maintained separately at:

`https://github.com/Brazenbillygoat/ocean-intelligence`

Its local checkout may exist at
`C:\Users\hyrum\repos\ocean-intelligence`. Treat that repository as read-only
from portfolio sessions unless the user explicitly authorizes changes there.
Use its current code, tests, `AGENTS.md`, and `docs/PROJECT_CONTEXT.md` when
verifying case-study claims.

Warple is maintained separately at:

`https://github.com/Brazenbillygoat/warple`

Its local checkout may exist at `C:\Users\hyrum\repos\warple`. Treat that
repository as read-only from portfolio sessions unless the user explicitly
authorizes changes there. Use its current public `main` branch, README, code,
and tests when verifying case-study claims. Preserve WindowPet and retained
Blooky attribution, and do not present cross-platform runtime behavior as
manually verified.
