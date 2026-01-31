"use client";

import React, { memo, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./Header.module.css";

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
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  // 로그아웃 함수
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>📈 Incoding Stock</div>

      <div className={styles.authContainer}>
        {user ? (
          <div className={styles.userInfo}>
            {/* 자산 데이터는 나중에 DB에서 가져올 예정이므로 일단 정적으로 표시 */}
            <div className={styles.balanceInfo}>
              <span className={styles.label}>예수금</span>
              <span className={styles.amount}>10,000,000원</span>
            </div>

            <span className={styles.userName}>
              <strong>{user.user_metadata.full_name}</strong>님
            </span>

            <button onClick={handleLogout} className={styles.logoutBtn}>
              로그아웃
            </button>
          </div>
        ) : (
          <button onClick={handleLogin} className={styles.loginBtn}>
            Google 로그인
          </button>
        )}
      </div>
    </header>
  );
});

Header.displayName = "Header";
export default Header;
