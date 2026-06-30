# Plan: Route Protection with Auth-Gated Layouts

## Context

Both group layouts currently render their children unconditionally. This plan adds client-side auth guards to each: `(public)` redirects signed-in users to `/heists`, and `(dashboard)` redirects signed-out users to `/login`. A simple loader is shown in both layouts while Firebase resolves the initial auth state, preventing a flash of the wrong content before any redirect fires.

---

## Files to Modify

### `app/(public)/layout.tsx`

- Add `"use client"` directive
- Import `useEffect` from `react`; `useRouter` from `next/navigation`; `useUser` from `@/hooks/useUser`
- Use `useEffect` to call `router.replace("/heists")` when `!loading && user`
- While `loading` is true, or while the redirect is pending (`!loading && user`), render a simple loader instead of children
- When `!loading && !user`, render the existing `<main className="public">{children}</main>`

### `app/(dashboard)/layout.tsx`

- Add `"use client"` directive
- Import `useEffect` from `react`; `useRouter` from `next/navigation`; `useUser` from `@/hooks/useUser`
- Use `useEffect` to call `router.replace("/login")` when `!loading && !user`
- While `loading` is true, or while the redirect is pending (`!loading && !user`), render a simple loader instead of children
- When `!loading && user`, render the existing `<Navbar /><main>{children}</main>`

### Loader

Both layouts render the same inline loader — a single `<div>` with centred text or a minimal spinner. No new component needed; keep it inline in each layout to avoid a shared dependency.

### `tests/layouts/public-layout.test.tsx` *(new file)*

Mock `@/hooks/useUser` and `next/navigation` (mock `useRouter` returning `{ replace: vi.fn() }`).

Tests:
1. Shows a loader when `loading` is true
2. Calls `router.replace("/heists")` and shows loader when user is authenticated
3. Renders children when user is not authenticated and loading is false

### `tests/layouts/dashboard-layout.test.tsx` *(new file)*

Same mocking pattern.

Tests:
1. Shows a loader when `loading` is true
2. Calls `router.replace("/login")` and shows loader when user is not authenticated
3. Renders children when user is authenticated and loading is false

---

## Reuse Notes

- `useUser()` at `hooks/useUser.ts` already exposes `{ user, loading }` — no changes needed.
- `AuthContext` default state has `loading: true`, so the loader always shows on first render before Firebase resolves.
- Both layouts import `Navbar` (dashboard only) — the client directive does not conflict.

---

## Verification

1. `npm test` — all 6 new layout tests pass alongside existing 28.
2. `npm run dev` — visit `/heists` while signed out → redirected to `/login`.
3. Visit `/login` while signed in → redirected to `/heists`.
4. Briefly see the loader on first load before redirect fires (observable on slow connections or by throttling in DevTools).
