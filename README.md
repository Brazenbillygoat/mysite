# Hyrum Butler Portfolio

Personal software-engineering portfolio for [Hyrum Butler](https://www.linkedin.com/in/hyrum-butler/).

The repository contains two intentionally different experiences:

- The [professional portfolio](https://brazenbillygoat.github.io/mysite/) is a
  framework-free, single-page site focused on engineering work, experience, and
  approach.
- [Hyrum's Sandbox](https://brazenbillygoat.github.io/mysite/sandbox/) preserves
  the original playful and interactive portfolio.

## Project structure

```text
.
|-- index.html                 Professional portfolio
|-- styles/portfolio.css       Professional styles and responsive behavior
|-- assets/                    Approved 2026 resume, favicon, and social-preview image
|-- sandbox/                   Preserved interactive portfolio
|-- docs/PROJECT_CONTEXT.md    Current architecture and project decisions
`-- AGENTS.md                  Repository development guidance
```

The professional page uses semantic HTML and CSS, plus one small inline
controller for its persisted light and dark theme toggle. When JavaScript is
unavailable or no manual preference is stored, CSS continues to follow the
visitor's system color preference. The Sandbox keeps its original JavaScript
and legacy dependencies isolated under `sandbox/`.

## Local development

Requires Node.js 22.12 or later.

```powershell
npm.cmd install
npm.cmd run dev
```

Vite serves the site for local development. There is no production build step.

## Validation

```powershell
npm.cmd run lint
npm.cmd run format:check
git diff --check
```

## Deployment

GitHub Pages serves the repository root from the `master` branch. The site lives
under the `/mysite/` project path, so local navigation and asset references use
relative URLs.

The primary public case study is
[Ocean Intelligence](https://github.com/Brazenbillygoat/ocean-intelligence), a
separate React and .NET vessel-research application.

[Warple](https://github.com/Brazenbillygoat/warple) is the secondary public case
study. It is a Tauri, React, Phaser, Matter.js, and Rust desktop companion
re-architected from WindowPet with a validated data-only profile boundary and
credited placeholder artwork.
