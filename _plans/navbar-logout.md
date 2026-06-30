# Plan: Navbar Logout Button

## Context

The Navbar already renders a user Avatar when signed in (via `useUser()`), but there is no way to sign out. This plan adds a logout button that appears only when a user is present and calls Firebase Auth `signOut` on click. No redirect is needed — the existing `onAuthStateChanged` listener in `AuthContext` will update the UI automatically.

---

## Files to Modify

### `components/Navbar/Navbar.tsx`

- Add `isSigningOut: boolean` state (false by default)
- Import `getAuth` and `signOut` from `firebase/auth`; import `app` from `@/lib/firebase`
- Add a `handleLogout` async function: set `isSigningOut` true, call `signOut(getAuth(app))`, reset `isSigningOut` in a finally block
- Inside the existing `{user && (...)}` block, add a logout `<button>` alongside the Avatar:
  - `onClick={handleLogout}`
  - `disabled={isSigningOut}`
  - Styled with a new `.logoutBtn` CSS class

### `components/Navbar/Navbar.module.css`

Add `.logoutBtn` — a subdued, text-style button (no background fill) so it reads as a secondary action next to the primary "Create Heist" button.

### `tests/components/Navbar.test.tsx`

Extend the existing test file with 3 new tests. Existing tests render `<Navbar />` without a provider and rely on the default context value (`user: null`). New tests use `vi.mock("@/hooks/useUser", ...)` to control the returned user state, and `vi.mock("firebase/auth", ...)` + `vi.mock("@/lib/firebase", ...)` to mock `signOut` — consistent with the pattern in `tests/hooks/useUser.test.tsx`.

1. Logout button is not in the document when no user is present
2. Logout button is rendered when a user is signed in
3. Clicking the logout button calls `signOut`

---

## Reuse Notes

- `app` singleton from `lib/firebase.ts` — call `getAuth(app)` inline, same pattern as signup page.
- `useUser()` at `hooks/useUser.ts` already provides `user` — no new data fetching needed.
- Navbar is already `"use client"` — no directive change needed.

---

## Verification

1. `npm test` — all Navbar tests pass including the 3 new ones.
2. `npm run dev` — sign in via `/signup`, visit `/heists`; logout button appears next to Avatar.
3. Click logout — Avatar and button disappear without a page reload.
