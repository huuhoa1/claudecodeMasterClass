# Spec for navbar-logout

branch: claude/feature/navbar-logout
figma_component (if used): N/A

## Summary

Add a logout button to the Navbar component. The button is only visible when a user is currently signed in. Clicking it signs the user out via Firebase Auth. No redirect happens after logout — the UI simply updates to reflect the signed-out state via the existing `useUser` auth listener.

## Functional Requirements

- The Navbar displays a "Logout" button when a user is signed in
- The button is hidden when no user is signed in
- Clicking the button signs the user out using Firebase Auth
- After logout, the Navbar updates automatically (the existing `onAuthStateChanged` listener handles this)
- No redirect occurs after logout

## Figma Design Reference (only if referenced)

N/A

## Possible Edge Cases

- The sign-out call could fail — the UI should not break silently if it does
- The button should not be clickable while a sign-out is already in progress to prevent double-calls

## Acceptance Criteria

- The logout button is visible in the Navbar when a user is signed in
- The logout button is not rendered when no user is signed in
- Clicking the button calls Firebase Auth sign-out
- After successful sign-out, the Navbar updates to reflect the logged-out state without a page reload
- The button is disabled or non-interactive while sign-out is in progress

## Open Questions

- Should the logout button have a distinct visual style from the "Create Heist" button, or match it?

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- The logout button is not rendered when no user is present
- The logout button is rendered when a user is signed in
- Clicking the logout button calls Firebase Auth sign-out
