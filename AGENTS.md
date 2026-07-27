# Portfolio repository instructions

These instructions apply to the entire repository.

## Start every task

1. Read this file and `docs/PROJECT_CONTEXT.md` completely before proposing or
   making portfolio changes.
2. If `docs/ACTIVE_PLAN.md` exists, read it completely after the persistent
   context files. It is mutable feature or session state, not project history.
3. Run `git status --short --branch`.
4. Inspect the current files involved in the task. Current code and repository
   state take precedence over documentation and an older plan.
5. Explain the intended approach before taking action.
6. Do not edit, move, delete, commit, push, deploy, or change external services
   unless the user explicitly authorizes that action in the current
   conversation.

## Repository purpose

This repository contains two intentionally different portfolio experiences:

- `/mysite/` is the professional portfolio and primary landing page.
- `/mysite/sandbox/` is "Hyrum's Sandbox," the preserved playful portfolio.

The professional site should communicate thoughtful engineering, dependable
software, systems thinking, practical problem solving, and craftsmanship. The
Sandbox should remain playful, strange, interactive, and fun. Do not blend the
two visual languages.

The professional site is a static, single-page portfolio. Do not introduce
React, Next.js, a component framework, a CMS, a database, authentication, or a
new deployment system without a demonstrated requirement and explicit user
approval.

## Hosting and URL rules

GitHub Pages hosts this project at:

`https://brazenbillygoat.github.io/mysite/`

As last verified on 2026-07-25, GitHub Pages uses its legacy build from the
`master` branch and repository root. Preserve this deployment model unless the
user explicitly asks to change it.

The site is hosted beneath the `/mysite/` project path, not at a domain root.
Therefore:

- Prefer document-relative internal URLs such as `./assets/example.jpg`.
- Link to the Sandbox with `./sandbox/`.
- Inside the Sandbox, keep its assets relative to `sandbox/index.html`.
- Do not use root-absolute asset or navigation URLs such as `/assets/file.css`
  or `/sandbox/`; they resolve against `brazenbillygoat.github.io/` and break
  the project-site path.
- Preserve directory-index URLs with trailing slashes where practical.
- Verify every local `href` and `src` after moving files.

Do not add `.openai/hosting.json`, Cloudflare hosting, a GitHub Actions workflow,
or another deployment service as part of ordinary portfolio work.

## Repository layout

The repository should follow this shape:

```text
/
|-- index.html
|-- assets/
|   |-- Hyrum-Butler-Resume.pdf
|   |-- images/
|   `-- og/
|-- styles/
|   `-- portfolio.css
|-- sandbox/
|   |-- index.html
|   |-- css/
|   |-- images/
|   `-- src/
|-- docs/
|   |-- PROJECT_CONTEXT.md
|   `-- ACTIVE_PLAN.md
|-- AGENTS.md
|-- .prettierignore
|-- package.json
|-- package-lock.json
|-- eslint.config.mjs
`-- prettier.config.js
```

This layout is descriptive, not permission to move files. Inspect the current
tree before relying on it.

## Professional portfolio rules

- Keep the professional site framework-free unless the user changes the
  decision.
- Prefer semantic HTML and a single focused stylesheet.
- Add JavaScript only for a clear behavior that native HTML and CSS cannot
  provide.
- Keep copy direct, factual, and human. Avoid inflated claims, corporate
  jargon, startup language, and generic portfolio filler.
- Lead with experience and engineering evidence. Do not bury useful
  information beneath a decorative hero.
- Ocean Intelligence is the primary public case study.
- Describe recent professional work without turning AVIXA into a promotional
  case study. AVIXA may appear factually in the work-history timeline.
- Keep outdated bootcamp projects out of the professional portfolio. They may
  remain in the Sandbox.
- Do not show the user's phone number in professional-page HTML.
- Contact options should be email, LinkedIn, GitHub, and the approved
  downloadable resume.
- Do not invent performance metrics, business outcomes, client names,
  testimonials, responsibilities, project facts, or employment claims.
- Do not imply that Ocean Intelligence is deployed publicly. Its source is
  public, but its application currently requires a protected server-side API
  token and is not a public hosted service.

## Visual direction

The professional portfolio should feel like a well-designed field guide or
expedition journal, not an outdoor-themed landing page.

Use:

- Warm off-white backgrounds.
- Muted pine greens, slate blues, warm neutrals, and restrained accents.
- Strong typography and generous whitespace.
- Thin rules, small section labels, and subtle map or contour references.
- Square or lightly rounded surfaces rather than oversized soft cards.
- Purposeful content hierarchy.

Avoid:

- Cartoon scenery, giant mountains, suns, clouds, or outdoor mascots.
- Glassmorphism, large gradients, excessive rounded cards, and SaaS layouts.
- Scroll-jacking, parallax, reveal-on-scroll effects, novelty cursors, and
  animation libraries.
- Large logo walls, badge clouds, and decorative technology icons.
- Generated filler imagery or model-authored SVG illustrations.

Keep the professional visual treatment separate from Sandbox assets and styles.

## Sandbox preservation

The current portfolio is a substantial interactive experience. Preserve its
appearance and behavior as closely as possible when it lives under
`sandbox/`.

- Move the Sandbox HTML, CSS, JavaScript, vendor scripts, and images together
  so its existing relative paths remain stable.
- Do not redesign, simplify, reformat wholesale, or remove Sandbox interactions
  during the professional redesign.
- Make only path, routing, accessibility, or narrowly required compatibility
  changes.
- Keep Bootstrap, jQuery, Magnific Popup, and existing remote font dependencies
  scoped to the Sandbox. Do not use them on the professional page.
- Treat `sandbox/src/jquery.magnific-popup*.js` as vendored code. Do not edit or
  format it without a specific reason.
- Keep the preserved legacy Sandbox excluded in `.prettierignore`. Do not run a
  broad formatter over it and create a large behavior-obscuring diff.
- Check keyboard behavior and reduced-motion handling when an interaction is
  touched.

## Accessibility and HTML quality

- Include a keyboard-visible skip link.
- Use `header`, `nav`, `main`, `section`, `article`, and `footer`
  appropriately.
- Maintain one `h1` and a logical heading hierarchy.
- Give every meaningful image useful alternative text and decorative images an
  empty `alt`.
- Ensure all interactions work with a keyboard and show a visible focus state.
- Do not communicate meaning by color alone.
- Respect `prefers-reduced-motion`.
- Keep text contrast at least WCAG AA.
- Use descriptive link text.
- External links opened in a new tab require `rel="noopener noreferrer"`.
- Do not add ARIA where native HTML already supplies the correct semantics.

## Comments and formatting

- Add comments when they explain accessibility behavior, responsive layout
  intent, a non-obvious positioning or overlap technique, project-path URL
  behavior, or another decision that a future maintainer could reasonably
  misread.
- Do not comment obvious syntax or merely restate property names.
- Keep comments concise, human, and focused on why the code exists.
- Preserve normal readable formatting. Do not mechanically normalize the
  Sandbox or vendored files.

## Content and privacy

- The approved downloadable resume is the frontend-forward
  `Hyrum Butler Resume.pdf` supplied by the user, renamed to
  `Hyrum-Butler-Resume.pdf` in the repository.
- The resume itself contains the user's phone number. The user approved using
  it as a download, but the number should not be repeated in page HTML.
- Hyrum is based in the Greater Kansas City Area and is currently looking for
  his next software engineering role.
- Employment dates and project claims must match the approved resume or
  inspected source repositories.
- Ask before adding new personal information.

## Working with Ocean Intelligence

Ocean Intelligence is maintained in a separate repository:

`https://github.com/Brazenbillygoat/ocean-intelligence`

The local checkout may exist at `C:\Users\hyrum\repos\ocean-intelligence`.
Treat it as read-only while working on this portfolio unless the user explicitly
authorizes changes to that repository.

Use its `AGENTS.md`, `docs/PROJECT_CONTEXT.md`, current code, and tests as the
source of truth. Do not copy credentials, tokens, internal notes, unfinished
claims, or private configuration into this portfolio. Do not call historical
AIS observations live vessel locations.

## Validation

Run checks proportional to the change. The normal local checks are:

```powershell
npm.cmd run lint
npm.cmd run format:check
git diff --check
git status --short --branch
```

Also inspect:

```powershell
git diff --stat
git diff
```

The current GitHub Pages deployment serves source files directly from the
repository root. Do not claim a production build was validated unless a real
build command exists and was run successfully.

Formatting checks cover the professional page and other first-party files while
the preserved Sandbox and generated lockfile remain ignored. Do not normalize
those excluded files wholesale.

Do not launch or open a browser preview. The user performs browser inspection.
If manual visual review is needed, provide exact URLs and a concise checklist.
Do not claim browser, responsive, or visual verification unless the user
performed it or explicitly authorized a supported browser workflow.

Before any requested deployment, confirm:

- The user separately authorized commit and push.
- GitHub Pages still targets the intended branch and root directory.
- Both `./` and `./sandbox/` work under the `/mysite/` project path.
- Local assets return successfully and no professional-page URL starts at `/`.

## Maintaining project context

`docs/PROJECT_CONTEXT.md` is the durable current-state handoff.

- Update it in the same change when a material feature changes the repository
  structure, current behavior, hosting assumptions, important design decisions,
  validation baseline, or key-file ownership.
- Keep it factual and concise. It is a current snapshot, not a chronological
  diary.
- Clearly label planned work as planned. Never describe a proposal as
  implemented.
- Update its verification date only after inspecting the current repository.
- Current files and repository state take precedence if the context becomes
  stale.
- Never store secrets, private credentials, sensitive personal information, or
  machine-specific secret paths in project context.

## Maintaining the active plan

`docs/ACTIVE_PLAN.md` is mutable implementation state for the current feature or
session. It is intentionally ignored by Git and is not a durable project record.

- Rewrite or replace it when the active feature changes and the user authorizes
  the new planning work.
- Make its instructions exact enough that a fresh implementation session can
  execute them without guessing or redesigning.
- Include scope, constraints, file-specific changes, non-goals, useful comments,
  verification, and manual-review expectations when those details matter.
- Update its status and checkboxes as the current work is completed.
- Record genuine blockers and deviations instead of silently changing the
  design.
- Do not rewrite completed work as though it were still planned.
- Do not preserve obsolete ideas in it merely for history. Durable current facts
  belong in `docs/PROJECT_CONTEXT.md`; durable operating rules belong here.
- Do not delete, archive, or replace it unless the user authorizes that action
  in the current conversation.
