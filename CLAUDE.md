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
npx vitest tests/components/Navbar.test.tsx
```

## Architecture

**Next.js App Router** with two route groups that share the root layout (`app/layout.tsx`) but have separate nested layouts:

- **`app/(public)/`** — Unauthenticated pages, no navbar. Intended as a routing hub: `page.tsx` (the root `/` route) should redirect to `/heists` when logged in and `/login` when not — auth logic is not yet implemented.
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

**Styling:** Tailwind CSS v4 via `@import "tailwindcss"` in `globals.css`. Custom design tokens are defined in the `@theme` block in `globals.css` (colours, font). Component-scoped styles use CSS Modules (e.g. `Navbar.module.css`). Global utility classes (`.page-content`, `.center-content`, `.form-title`) are defined in `globals.css`.

**Components** live in `components/<ComponentName>/` with an `index.ts` barrel export.

**Tests** mirror the `components/` structure under `tests/components/`. Uses Vitest + Testing Library with jsdom; setup file is `vitest.setup.ts`.

## Additional Coding Preferences
- Do NOT use semicolons for Javascript or Typescript code.
- Do NOT apply tailwind classes directly in component templates unless essential of just 1 at most. If an element
needs more than a single tailwind class, combine them into a custom class using the `@apply` directive.
- Use minimal project dependencies where possible
- Use the `git switch -c`command to switch to new branches, not `git checkout`.
