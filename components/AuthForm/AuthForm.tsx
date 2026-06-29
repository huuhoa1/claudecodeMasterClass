"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import styles from "./AuthForm.module.css";

type AuthMode = "login" | "signup";

const copy = {
  login: {
    submit: "Login",
    prompt: "Don't have an account?",
    linkLabel: "Sign up",
    linkHref: "/signup",
  },
  signup: {
    submit: "Sign Up",
    prompt: "Already have an account?",
    linkLabel: "Log in",
    linkHref: "/login",
  },
};

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const [showPassword, setShowPassword] = useState(false);
  const { submit, prompt, linkLabel, linkHref } = copy[mode];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    console.log({ email, password });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span>Email</span>
        <input type="email" name="email" autoComplete="email" />
      </label>

      <label className={styles.field}>
        <span>Password</span>
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete={
              mode === "login" ? "current-password" : "new-password"
            }
          />
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => setShowPassword((shown) => !shown)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </label>

      <button type="submit" className="btn">
        {submit}
      </button>

      <p className={styles.switch}>
        {prompt} <Link href={linkHref}>{linkLabel}</Link>
      </p>
    </form>
  );
}
