"use client";

import React, { memo, useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./Header.module.css";
import UserInfo from "./UserInfo";

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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 구글 로그인 함수
  const handleLogin = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }, []);

  // 로그아웃 함수
  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.logo}>📈 Incoding Stock</div>

      <UserInfo
        user={user}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
    </header>
  );
});

Header.displayName = "Header";
export default Header;
