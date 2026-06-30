"use client";

import { Clock8 } from "lucide-react";
import Link from "next/link";
import styles from "./Navbar.module.css";
import { useUser } from "@/hooks/useUser";
import Avatar from "@/components/Avatar";

export default function Navbar() {
  const { user, displayName, email } = useUser();
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
        </ul>
      </nav>
    </div>
  );
}
