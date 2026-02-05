// lib/auth.ts (새로 생성하거나 lib/supabase.ts에 추가)
import { supabase } from "./supabase";

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // 인증 후 돌아올 콜백 URL 설정
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) console.error("Login Error:", error.message);
  return { data, error };
};