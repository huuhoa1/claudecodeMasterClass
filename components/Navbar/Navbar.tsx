"use client";

import { useState } from "react";
import { Clock8 } from "lucide-react";
import Link from "next/link";
import { getAuth, signOut } from "firebase/auth";
import styles from "./Navbar.module.css";
import { useUser } from "@/hooks/useUser";
import Avatar from "@/components/Avatar";
import app from "@/lib/firebase";

export default function Navbar() {
  const { user, displayName, email } = useUser();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    setIsSigningOut(true);
    try {
      await signOut(getAuth(app));
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className={styles.siteNav}>
      <nav>
        <header>
          <h1>
            <Link href="/heists">
              P<Clock8 className={styles.logo} size={14} strokeWidth={2.75} />
              cket Heist
            </Link>
          </h1>
          <div>Tiny missions. Big office mischief.</div>
        </header>
        <ul>
          <li>
            <Link href="/heists/create" className="btn">
              Create Heist
            </Link>
          </li>
          {user && (
            <li>
              <Avatar name={displayName ?? email ?? ""} />
            </li>
          )}
          {user && (
            <li>
              <button
                className={styles.logoutBtn}
                onClick={handleLogout}
                disabled={isSigningOut}
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
