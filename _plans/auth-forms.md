# Plan: Authentication Forms (Login & Signup)

## Context

The `/login` and `/signup` pages are currently placeholder stubs with only a heading. This plan implements a shared `AuthForm` component used by both pages, delivering email/password fields, a show/hide password toggle, a submit button, a link to switch between forms, and console-logging on submit (no real auth yet).

The open questions in the spec were resolved:
- **Shared component:** Yes — one `AuthForm` used by both pages via a `mode` prop.
- **Icon library:** No preference stated; Lucide React (`lucide-react`) is already installed and used in `Navbar`, so we'll use its `Eye` / `EyeOff` icons.

---

## Files to Create

### `components/AuthForm/AuthForm.tsx`
A `"use client"` component (needs state for password visibility and form submission).

Props:
```
mode: "login" | "signup"
```

Behaviour:
- Controlled `showPassword: boolean` state toggled by the eye icon button.
- On submit: `event.preventDefault()`, then `console.log({ email, password })`.
- Renders:
  - Email `<input type="email">`
  - Password `<input type="password" | "text">` + `<button>` with `<Eye>` / `<EyeOff>` from lucide-react
  - Submit `<button>` labelled **"Login"** or **"Sign Up"** depending on `mode`
  - `<Link>` to the other form:
    - login mode → "Don't have an account? Sign up" → `/signup`
    - signup mode → "Already have an account? Log in" → `/login`

### `components/AuthForm/AuthForm.module.css`
Scoped styles using `@reference "../../app/globals.css"` + `@apply`. Key classes:
- `.form` — flex column layout, gap between fields
- `.field` — label + input stacked
- `.passwordWrapper` — relative wrapper so the toggle button overlays the input
- `.toggleBtn` — absolute positioned eye icon button, no background

### `components/AuthForm/index.ts`
Barrel export: `export { default } from "./AuthForm"`

### `tests/components/AuthForm.test.tsx`
Uses Vitest + Testing Library. Test cases:
1. Login mode — renders email field, password field, "Login" submit button
2. Signup mode — renders email field, password field, "Sign Up" submit button
3. Password field default type is `"password"`
4. Clicking toggle → type becomes `"text"`; clicking again → `"password"`
5. Login mode has a link to `/signup`
6. Signup mode has a link to `/login`
7. Submitting the form calls `console.log` with `{ email, password }`

---

## Files to Modify

### `app/(public)/login/page.tsx`
Replace placeholder content with `<AuthForm mode="login" />`, keeping the existing `.center-content` / `.page-content` wrapper divs.

### `app/(public)/signup/page.tsx`
Same as above with `<AuthForm mode="signup" />`.

---

## Reuse Notes

- Global layout classes `.center-content`, `.page-content`, `.form-title`, `.btn` from `app/globals.css` should be applied where appropriate (page wrappers, submit button).
- Follow the exact component folder convention established by `components/Navbar/` and `components/Avatar/`.
- CSS Module files must start with `@reference "../../app/globals.css"` (same as `Navbar.module.css` and `Avatar.module.css`).

---

## Verification

1. `npm test` — all AuthForm tests pass.
2. `npm run dev` — visit `/login`: form renders, toggle works, submit logs to console, link goes to `/signup`.
3. Visit `/signup`: same checks, submit button says "Sign Up", link goes to `/login`.
4. `npm run build` — no type errors.
