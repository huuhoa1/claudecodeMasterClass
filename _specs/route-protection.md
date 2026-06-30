# Spec for route-protection

branch: claude/feature/route-protection
figma_component (if used): N/A

## Summary

Add client-side route protection to both route groups. Pages in the `(public)` group (login, signup) should redirect authenticated users away. Pages in the `(dashboard)` group (heists and related routes) should redirect unauthenticated users away. Both group layouts should display a simple loading indicator while Firebase resolves the initial auth state, preventing a flash of the wrong content before any redirect fires.

## Functional Requirements

- The `(public)` group layout detects when a user is authenticated and redirects them to `/heists`
- The `(dashboard)` group layout detects when a user is unauthenticated and redirects them to `/login`
- Both layouts show a simple loader while `loading` is true (i.e. Firebase has not yet resolved auth state)
- Once auth state is known, the redirect fires immediately if the user is in the wrong group — the page content never renders
- The `useUser` hook is used in both layouts to access `user` and `loading`
- No server-side middleware is used — this is entirely client-side

## Figma Design Reference (only if referenced)

N/A

## Possible Edge Cases

- Firebase takes a moment to resolve auth state on first load — the loader prevents content flash during this window
- A user manually navigating to `/login` while already signed in should be silently redirected to `/heists`
- A user with an expired or revoked token may still have a `user` object briefly — this is acceptable at this stage
- The `/preview` route lives in `(public)` and should follow the same protection rules as other public pages

## Acceptance Criteria

- Visiting `/login` or `/signup` while signed in redirects to `/heists`
- Visiting `/heists` or any dashboard route while signed out redirects to `/login`
- A loader is shown in both group layouts while auth state is being resolved
- No flash of protected content occurs before the redirect fires
- The `useUser` hook is the sole source of auth state for both layouts

## Open Questions

- Should the loader be a full-page spinner or just a minimal inline indicator?
- Should the `(public)` group layout be a new file, or does one already exist?

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- The public layout shows a loader when auth state is loading
- The public layout redirects to `/heists` when a user is authenticated
- The public layout renders children when no user is authenticated
- The dashboard layout shows a loader when auth state is loading
- The dashboard layout redirects to `/login` when no user is authenticated
- The dashboard layout renders children when a user is authenticated
