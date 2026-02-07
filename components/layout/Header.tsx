"use client";

import React, { memo, use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import styles from "./Header.module.css";
import UserInfo from "./UserInfo";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

const Header = memo(() => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
        console.log("Auth state changed:", event, session);
      },
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    console.log("Current user in Header:", user);
  }, [user]);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        📈 Incoding Stock
      </Link>

      <UserInfo user={user} />
    </header>
  );
});

Header.displayName = "Header";
export default Header;
