# Spec for login-firebase-auth

branch: claude/feature/login-firebase-auth
figma_component (if used): N/A

## Summary

Wire the existing login form at `/login` to Firebase Authentication so that submitting it signs an existing user in. On success, a success message is shown in the UI. No redirect occurs after login — the auth state updates automatically via the existing `onAuthStateChanged` listener.

## Functional Requirements

- Submitting the login form with a valid email and password signs the user in via Firebase Auth
- On successful login, a success message is displayed in the UI (e.g. "You are now logged in as [codename]")
- If login fails (e.g. wrong password, user not found), a meaningful error message is shown
- The form is disabled and shows a loading state while the sign-in request is in progress to prevent double-submission
- No redirect occurs after login

## Figma Design Reference (only if referenced)

N/A

## Possible Edge Cases

- Invalid credentials should surface a clear error rather than a silent failure
- The form should not be submittable while a sign-in is already pending
- A user who has never signed up should see a helpful error (e.g. "No account found with this email")

## Acceptance Criteria

- Submitting with correct credentials signs the user in via Firebase Auth
- The success message shows the user's codename (their Firebase `displayName`)
- Submitting with incorrect credentials shows an appropriate error message
- The submit button is disabled while the login request is in progress
- After successful login, `useUser()` reflects the signed-in user

## Open Questions

- What should the success message look like — inline below the form, or a banner?
- Should the success message link to `/heists` or include a manual redirect option?

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Submitting the form calls Firebase `signInWithEmailAndPassword` with the correct arguments
- On success, a success message is displayed containing the user's display name
- On failure, an error message is displayed
- The submit button is disabled while sign-in is pending
