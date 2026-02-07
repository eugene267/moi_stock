"use client";
import { memo, use, useCallback } from "react";
import styles from "./UserInfo.module.css";
import { supabase } from "@/utils/supabase/client";

interface UserInfoProps {
  user: any;
}

const UserInfo = memo(({ user }: UserInfoProps) => {
  // 구글 로그인 함수
  const handleLogin = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }, [supabase]);

  // 로그아웃 함수
  const handleLogout = useCallback(async () => {
    try {
      console.log("Logging out user:", user);
      await supabase.auth.signOut({ scope: "local" });
      console.log("Logout successful");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [supabase, user]);

  return (
    <div className={styles.authContainer}>
      {user ? (
        <div className={styles.userInfo}>
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
  );
});

UserInfo.displayName = "UserInfo";
export default UserInfo;
