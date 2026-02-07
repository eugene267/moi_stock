"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import styles from "./Header.module.css";
import UserInfo from "./UserInfo";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

const Header = memo(() => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // 1. 현재 세션 확인 (새로고침 시 로그인 유지)
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    getSession();

    // 2. 로그인/로그아웃 상태 실시간 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      },
    );

    return () => subscription.unsubscribe();
  }, []);

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
