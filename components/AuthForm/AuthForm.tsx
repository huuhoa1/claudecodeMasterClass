"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import styles from "./AuthForm.module.css";

type AuthMode = "login" | "signup";

interface AuthFormProps {
  mode: AuthMode;
  onSubmit?: (email: string, password: string) => Promise<void>;
}

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

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { submit, prompt, linkLabel, linkHref } = copy[mode];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!onSubmit) {
      console.log({ email, password });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSubmit(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
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

      <button type="submit" className="btn" disabled={isLoading}>
        {isLoading ? "Please wait…" : submit}
      </button>

      {error && <p className={styles.error}>{error}</p>}

      <p className={styles.switch}>
        {prompt} <Link href={linkHref}>{linkLabel}</Link>
      </p>
    </form>
  );
}
