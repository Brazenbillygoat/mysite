# Portfolio repository instructions

Read this file and `docs/PROJECT_CONTEXT.md` before proposing or making
changes. Read `docs/ACTIVE_PLAN.md` only if it exists and its status is not
`NO ACTIVE PLAN`. Check the current branch and dirty state, then inspect the
relevant files. Current implementation wins when documentation is stale.

Explain the approach before acting. Do not edit, move, delete, install, stage,
commit, push, deploy, launch a preview, or change external services without the
user's explicit permission. Preserve unrelated work.

## Product and repository boundary

- The repository root is Hyrum's professional, static, framework-free
  portfolio. `sandbox/` is the preserved playful legacy portfolio.
- Keep their visual languages, assets, dependencies, and formatting separate.
- Do not add a framework, CMS, backend, database, authentication, client-side
  routing, or deployment system without a demonstrated need and approval.
- Preserve the Sandbox. Do not redesign, simplify, broadly reformat, or edit
  vendored scripts during professional-site work.

## Hosting and URLs

GitHub Pages serves the repository below `/mysite/`, historically from
`master` and the repository root. Reverify that external setting before a
deployment.

- Use document-relative local URLs, including `./sandbox/`.
- Never use root-absolute local asset or navigation URLs.
- Verify local `href` and `src` values after moves.
- Do not add another hosting system or workflow during ordinary portfolio work.

## Professional site rules

- Use semantic HTML, a focused stylesheet, and JavaScript only for behavior
  that HTML and CSS cannot provide cleanly.
- Keep copy factual and direct. Do not invent metrics, outcomes, client names,
  testimonials, responsibilities, or project facts.
- Ocean Intelligence is the primary public case study; Warple is secondary.
  Verify claims against their current repositories and never copy secrets or
  private notes.
- Do not describe Ocean Intelligence as publicly hosted or historical AIS as a
  live vessel location.
- Do not place Hyrum's phone number in page HTML. Ask before adding personal
  information.
- Preserve the field-guide visual direction: warm neutrals, pine and slate,
  strong typography, restrained contour references, thin rules, and mostly
  square surfaces. Avoid generic SaaS styling, generated filler art, novelty
  cursors, scroll-jacking, or broad animation systems.

## Accessibility and interaction

Maintain semantic regions, a useful heading hierarchy, keyboard operation,
visible focus, meaningful image alternatives, reduced-motion behavior,
descriptive links, and WCAG AA contrast. Prefer native semantics over ARIA.
External new-tab links require `rel="noopener noreferrer"`.

Do not launch or open a browser preview. Hyrum owns browser, responsive, and
visual review. Never claim visual verification without it.

## Verification and documentation

Run checks proportional to the change. Normal checks are:

```powershell
npm.cmd run lint
npm.cmd run format:check
git diff --check
git status --short --branch
```

Inspect the complete diff. Do not broadly format the Sandbox or vendored files.
There is no production build command; GitHub Pages serves source files.

Keep `docs/PROJECT_CONTEXT.md` concise and current. Use
`docs/ACTIVE_PLAN.md` only for approved work in progress, never history.
