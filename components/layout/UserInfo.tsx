"use client";
import { memo } from "react";
import styles from "./UserInfo.module.css";

interface UserInfoProps {
  user: any;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

const UserInfo = memo(({ user, handleLogin, handleLogout }: UserInfoProps) => {
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
