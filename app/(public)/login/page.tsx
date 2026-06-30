"use client";

import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "@/lib/firebase";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleLogin(email: string, password: string) {
    const { user } = await signInWithEmailAndPassword(
      getAuth(app),
      email,
      password,
    );
    setSuccessMessage(`Welcome back, ${user.displayName ?? user.email}!`);
  }

  return (
    <div className="center-content">
      <div className="page-content">
        <h2 className="form-title">Log in to Your Account</h2>
        <AuthForm mode="login" onSubmit={handleLogin} />
        {successMessage && <p className="form-title">{successMessage}</p>}
      </div>
    </div>
  );
}
