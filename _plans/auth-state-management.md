# Plan: Auth State Management (`useUser` hook)

## Context

No auth state management exists yet. Components that need to know who is logged in currently have no way to find out. This plan introduces a single Firebase `onAuthStateChanged` listener mounted at the app root, exposed via a `useUser()` hook. The spec answered the open questions: the context should expose `user`, `loading`, plus derived `email`, `uid`, and `displayName`. The provider goes in the root layout so both public and dashboard routes can access it. No login/logout logic is included.

---

## Files to Create

### `contexts/AuthContext.tsx`
`"use client"` component. Sets up one `onAuthStateChanged` listener in a `useEffect` (cleaned up on unmount). Stores Firebase `User | null` in state. Also derives `email`, `uid`, `displayName` from the user object for convenient access. Exports:
- `AuthProvider` — wraps the app; registers the listener
- `AuthContext` — the raw context (consumed by `useUser`)

State shape: `{ user: User | null, loading: boolean, email: string | null, uid: string | null, displayName: string | null }`

### `hooks/useUser.ts`
`"use client"` hook. Consumes `AuthContext` and returns the full context value. Throws a clear error if called outside `AuthProvider`.

### `tests/hooks/useUser.test.tsx`
Mocks `firebase/auth`'s `onAuthStateChanged`. Tests:
1. Returns `null` user + `loading: true` before listener fires
2. Returns user object + `loading: false` after listener fires with a user
3. Returns `null` user + `loading: false` after listener fires with null
4. Listener is only registered once even when the component re-renders

---

## Files to Modify

### `app/layout.tsx`
Import `AuthProvider` from `contexts/AuthContext` and wrap `{children}` with it. Root layout stays a server component — this works because Next.js App Router allows server components to render client components.

```
<body>
  <AuthProvider>
    {children}
  </AuthProvider>
</body>
```

### `components/Navbar/Navbar.tsx`
Add `"use client"` directive. Call `useUser()` and render `<Avatar>` with the user's `displayName` or `email` (fallback) when `user` is not null. No change when logged out.

---

## Reuse Notes

- Firebase app singleton is already in `lib/firebase.ts` — import it and call `getAuth(app)` to get the Auth instance; do not re-initialise.
- `Avatar` component at `components/Avatar/Avatar.tsx` already accepts a `name: string` prop and generates initials — pass `displayName ?? email` to it.
- Follow the `"use client"` + CSS Module + barrel export convention established by `components/Navbar/` and `components/Avatar/`.

---

## Verification

1. `npm test` — all useUser tests pass.
2. `npm run dev` — visit `/heists`; Navbar shows the Avatar with the signed-in user's initials (sign in manually via Firebase console or the AuthForm to test).
3. Sign out via Firebase console → Navbar Avatar disappears without a page reload.
4. `npm run build` — no type errors.

## Out of Scope
- Do not use the hook anywhere in the application yet.