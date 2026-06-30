# Plan: Login Form Wired to Firebase Auth

## Context

The login form at `/login` renders `<AuthForm mode="login" />` but has no `onSubmit` handler — it currently just logs credentials to the console. This plan wires it to Firebase Auth's `signInWithEmailAndPassword` and displays a success message showing the user's codename after a successful login. No redirect occurs. The pattern mirrors the signup page exactly.

---

## Files to Modify

### `app/(public)/login/page.tsx`

- Add `"use client"` directive
- Add `successMessage: string | null` state (null by default)
- Import `getAuth`, `signInWithEmailAndPassword` from `firebase/auth`; import `app` from `@/lib/firebase`
- Define `handleLogin(email, password)` async function:
  1. `const { user } = await signInWithEmailAndPassword(getAuth(app), email, password)`
  2. `setSuccessMessage(\`Welcome back, ${user.displayName ?? user.email}!\`)`
- Pass `handleLogin` as the `onSubmit` prop to `<AuthForm mode="login" />`
- Render the success message as a `<p>` below the form when `successMessage` is set (use global utility classes — no new CSS needed)

### `tests/app/login.test.tsx` *(new file)*

Mock `firebase/auth` and `@/lib/firebase`. Render `<LoginPage />` directly (AuthForm renders inside it; no extra wrapper needed since AuthForm has no Router dependency).

Tests:
1. Submitting the form calls `signInWithEmailAndPassword` with the entered email and password
2. On success, a success message containing the user's display name is shown
3. On failure, an error message is shown (bubbles up through AuthForm's existing error handling)

---

## Reuse Notes

- `getAuth(app)` pattern — identical to `app/(public)/signup/page.tsx`; no new lib file needed.
- `AuthForm` `onSubmit` prop — already supports async handlers with loading/error state; no changes to the component needed.
- Error display — already handled inside `AuthForm` when `onSubmit` rejects; login page only needs to manage the success case.

---

## Verification

1. `npm test` — all tests pass including the 3 new login page tests.
2. `npm run dev` — visit `/login`, submit valid credentials; success message appears with the user's codename.
3. Submit wrong credentials — error message appears below the button (rendered by AuthForm).
4. Firebase Console → Authentication: last sign-in timestamp updates for the user.
