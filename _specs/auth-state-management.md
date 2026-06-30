# Spec for auth-state-management

branch: claude/feature/auth-state-management
figma_component (if used): N/A

## Summary

Introduce a global, realtime authentication state listener that tracks the currently signed-in Firebase user and exposes it throughout the app via a `useUser` hook. Any component or page can call `useUser()` to get the current user object (or `null` when logged out), without prop-drilling or duplicated listeners. This is the foundation for user-aware UI — not for implementing login/logout flows themselves.

## Functional Requirements

- A single Firebase Auth `onAuthStateChanged` listener is set up once at the app level and stays active for the lifetime of the session
- The listener updates a shared state value whenever the auth state changes (sign-in, sign-out, token refresh)
- A `useUser` hook returns the current user object when signed in, or `null` when signed out
- The hook is usable in any server or client component that requires knowledge of the current user
- The initial auth state (loading vs. resolved) is handled — consumers can tell whether auth has been checked yet or is still resolving
- No sign-up, login, or logout logic is included in this feature

## Figma Design Reference (only if referenced)

N/A

## Possible Edge Cases

- Auth state is still loading on first render — components should not flash "logged out" content before Firebase has resolved the initial state
- The listener should be registered only once, even under React Strict Mode (which mounts components twice in development)
- If the Firebase app is not yet initialised when the hook is called, it should degrade gracefully

## Acceptance Criteria

- `useUser()` returns `null` when no user is signed in
- `useUser()` returns the Firebase `User` object when a user is signed in
- Auth state updates in realtime — signing in or out elsewhere in the app is reflected immediately without a page reload
- The listener is registered only once for the lifetime of the app session
- A loading/pending state is available so components can avoid rendering prematurely
- Any existing component that references a user can be updated to use `useUser()` instead

## Open Questions

- Should the auth context expose only `user` and `loading`, or also derived values like `isAuthenticated`? email, uid, displayName
- Where should the context provider be mounted — the root layout, or a dedicated auth wrapper component?

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- `useUser` returns `null` when no user is signed in
- `useUser` returns the user object when a user is present
- The loading state is `true` before auth resolves and `false` after
- The provider does not register more than one listener on re-render
