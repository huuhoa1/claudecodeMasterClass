# Plan: Signup with Firebase Auth, Codename & Firestore Document

## Context

The signup form at `/signup` currently only logs credentials to the console. This plan wires it to Firebase Auth to create real accounts, generates a random heist-themed codename as the user's `displayName`, and writes a `users/{uid}` document to Firestore with `{ id, codename }` (no email stored). After success the user is redirected to `/login`.

---

## Files to Create

### `lib/generateCodename.ts`
Pure utility. Three arrays of 20 heist-themed words each (adjectives, titles, action-nouns — all unique across sets). Picks one word at random from each array and returns them joined in PascalCase (e.g. `SilentFalconVault`).

### `lib/db.ts`
Exports the Firestore database instance via `getFirestore(app)`, mirroring the pattern in `lib/firebase.ts`. Keeps Firestore initialisation in one place for reuse.

### `tests/lib/generateCodename.test.ts`
Tests:
1. Returns a non-empty string
2. Result is PascalCase (starts with uppercase, no spaces or separators)
3. Returns a different value on repeated calls (probabilistic — run a small sample)

---

## Files to Modify

### `components/AuthForm/AuthForm.tsx`
- Add optional prop: `onSubmit?: (email: string, password: string) => Promise<void>`
- Add internal state: `isLoading: boolean` (false), `error: string | null` (null)
- In `handleSubmit`: if `onSubmit` is provided, set `isLoading` true, call `onSubmit(email, password)`, clear error on success; on rejection set `error` to the Firebase error message; always reset `isLoading` after
- If `onSubmit` is not provided, fall back to `console.log` (preserves existing login-mode behaviour)
- Disable the submit `<button>` while `isLoading`
- Render an error message element below the submit button when `error` is set

### `components/AuthForm/AuthForm.module.css`
Add `.error` utility class for the error message (coloured using `--color-error` token).

### `app/(public)/signup/page.tsx`
- Add `"use client"` directive
- Get the Firebase Auth instance via `getAuth(app)` (import `app` from `lib/firebase.ts`)
- Import `db` from `lib/db.ts`
- Define `handleSignup(email, password)` async function:
  1. `createUserWithEmailAndPassword(auth, email, password)` → `{ user }`
  2. `const codename = generateCodename()`
  3. `await updateProfile(user, { displayName: codename })`
  4. `await setDoc(doc(db, 'users', user.uid), { id: user.uid, codename })`
  5. `router.push('/login')` (use `useRouter` from `next/navigation`)
- Pass `handleSignup` as the `onSubmit` prop to `<AuthForm mode="signup" />`

### `tests/components/AuthForm.test.tsx`
Add three new tests:
1. When `onSubmit` prop is provided, submitting the form calls it with the entered email and password
2. The submit button is disabled while `onSubmit` is pending (returning an unresolved promise)
3. When `onSubmit` rejects, an error message is displayed in the UI

---

## Reuse Notes

- `app` singleton from `lib/firebase.ts` — import and call `getAuth(app)` in the signup page; do not re-initialise.
- `generateCodename` stays pure (no Firebase imports) so it is easy to test without mocking.
- The existing `onSubmit`-less AuthForm tests continue to pass unchanged — the prop is optional.
- Firebase mocking pattern from `tests/hooks/useUser.test.tsx`: `vi.mock("firebase/auth", ...)` + `vi.mock("@/lib/firebase", ...)` hoisted before imports.

---

## Verification

1. `npm test` — all tests pass including new generateCodename and AuthForm tests.
2. `npm run dev` — visit `/signup`, enter a new email + password, submit.
3. Firebase Console → Authentication → Users: new user appears.
4. Firebase Console → Firestore → `users` collection: document with `id` and `codename` exists, no `email` field.
5. The user's `displayName` in Firebase Auth matches the `codename` in Firestore.
6. Browser is redirected to `/login` after successful signup.
