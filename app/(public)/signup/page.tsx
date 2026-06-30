"use client";

import { useRouter } from "next/navigation";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import app from "@/lib/firebase";
import db from "@/lib/db";
import { generateCodename } from "@/lib/generateCodename";
import AuthForm from "@/components/AuthForm";

export default function SignupPage() {
  const router = useRouter();

  async function handleSignup(email: string, password: string) {
    const auth = getAuth(app);
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const codename = generateCodename();
    await updateProfile(user, { displayName: codename });
    await setDoc(doc(db, "users", user.uid), { id: user.uid, codename });
    router.push("/login");
  }

  return (
    <div className="center-content">
      <div className="page-content">
        <h2 className="form-title">Signup for an Account</h2>
        <AuthForm mode="signup" onSubmit={handleSignup} />
      </div>
    </div>
  );
}
