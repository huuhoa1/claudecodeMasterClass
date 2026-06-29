# Spec for auth-forms

branch: claude/feature/auth-forms
figma_component (if used): N/A

## Summary

Add functional authentication forms to the `/login` and `/signup` pages. Each page renders a form with email and password fields, a toggle to show/hide the password, and a submit button. On submission, form data is logged to the console (no real auth yet). Users can easily navigate between the two forms via a link.

## Functional Requirements

- `/login` page renders a login form with:
  - Email input field
  - Password input field with show/hide toggle icon
  - Submit button labelled "Login"
  - Link to `/signup` for users without an account
- `/signup` page renders a signup form with:
  - Email input field
  - Password input field with show/hide toggle icon
  - Submit button labelled "Sign Up"
  - Link to `/login` for users who already have an account
- The show/hide password toggle switches the input type between `password` and `text`
- On form submission, the email and password values are logged to the browser console
- Form submission does not navigate away or call any API

## Figma Design Reference (only if referenced)

N/A

## Possible Edge Cases

- User submits the form with empty fields — log should still fire (no validation required for now)
- Password is visible when the user switches between pages — state resets on mount
- Toggle icon should accurately reflect the current visibility state

## Acceptance Criteria

- Visiting `/login` shows a working login form
- Visiting `/signup` shows a working signup form
- The password field hides text by default; clicking the toggle reveals/hides it
- Submitting either form logs `{ email, password }` to the console
- Each form has a link that navigates to the other form

## Open Questions

- Should both forms share a single reusable `AuthForm` component, or remain separate page-level forms? Yes
- Is there a preferred icon library/set for the show/hide password toggle, or should we use an inline SVG? No

## Testing Guidelines

Create a test file(s) in the ./tests folder for the new feature, and create meaningful tests for the following cases, without going too heavy:

- Login form renders email field, password field, and submit button
- Signup form renders email field, password field, and submit button
- Password field starts with type `password`
- Clicking the show/hide toggle changes the password field type to `text`, and back again
- Login form contains a link to `/signup`
- Signup form contains a link to `/login`
