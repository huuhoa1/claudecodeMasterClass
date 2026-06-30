# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server at localhost:3000
npm run build     # production build
npm run lint      # run ESLint
npm test          # run all tests with Vitest
```

Run a single test file:
```bash
npx vitest tests/components/AuthForm.test.tsx
```

## Architecture

**Next.js App Router** with two route groups that share the root layout (`app/layout.tsx`) but have separate nested layouts:

- **`app/(public)/`** — Unauthenticated pages, no navbar. `page.tsx` (the root `/` route) should redirect to `/heists` when logged in and `/login` when not — auth logic is not yet implemented.
- **`app/(dashboard)/`** — Authenticated pages, wraps content in `Navbar` + `<main>`. Houses all heist-related routes under `/heists`.

**Routing structure:**
```
/                   → (public)/page.tsx       splash / auth redirect
/login              → (public)/login/
/signup             → (public)/signup/
/preview            → (public)/preview/       dev sandbox for new components
/heists             → (dashboard)/heists/     lists active, assigned, expired heists
/heists/[id]        → (dashboard)/heists/[id]/
/heists/create      → (dashboard)/heists/create/
```

**Styling:** Tailwind CSS v4 via `@import "tailwindcss"` in `globals.css`. Custom design tokens are defined in the `@theme` block in `globals.css` (colours, font). Global utility classes (`.page-content`, `.center-content`, `.form-title`, `.btn`) are also defined there.

Component-scoped styles use CSS Modules. Every CSS Module that uses `@apply` with custom theme tokens **must** start with:
```css
@reference "../../app/globals.css";
```
Without this, Tailwind v4 cannot resolve custom tokens (e.g. `bg-primary`, `text-body`) inside CSS Modules.

**Components** live in `components/<ComponentName>/` with three files: the component `.tsx`, a `.module.css`, and an `index.ts` barrel export.

**Tests** mirror the `components/` structure under `tests/components/`. Uses Vitest + Testing Library with jsdom; setup file is `vitest.setup.ts`. Use accessibility-first queries (`getByRole`, `getByLabelText`).

## Planning & Specs Workflow

- `_specs/` — feature spec files (created by `/spec` slash command). Commit these.
- `_plans/` — implementation plans (created during plan mode). Commit these.

## Custom Slash Commands

- `/spec <idea>` — creates a spec file in `_specs/` and a new git branch `claude/feature/<slug>`
- `/commit-message` — analyses the staged diff and proposes a commit message
- `/component` — scaffolds a new component using TDD

## Coding Preferences

- No semicolons in JS/TS.
- Do not apply more than one Tailwind class directly in JSX. If an element needs multiple classes, use a custom class with `@apply` in the CSS Module.
- Use `git switch -c` to create new branches, not `git checkout`.
- Use minimal project dependencies.

## Checking Documentation
- **important:** When implementing any lib/framework specific feature, ALWAYS check the appropriate lib/framework documentation using the Context7 MCP server before writing any code.
