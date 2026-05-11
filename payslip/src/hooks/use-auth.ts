import { api, tokenStore, userStore, type AuthUser } from "@/lib/api";
import { useEffect, useState } from "react";

export function useAuth() {
  // Start with null to avoid showing stale cached data
  const [user, setUserState] = useState<AuthUser | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    const token = tokenStore.get();

    if (!token) {
      setLoading(false);
      return;
    }

    // 🔥 Always fetch fresh user data from backend to get latest avatar
    api
      .me()
      .then(({ user }) => {
        if (cancelled) return;

        // Update both state and localStorage with fresh data
        userStore.set(user);
        setUserState(user);
      })
      .catch(() => {
        tokenStore.clear();
        userStore.clear();
        setUserState(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // 🔥 stable setter
  const setUser = (user: AuthUser | null) => {
    if (user) userStore.set(user);
    else userStore.clear();

    setUserState(user);
  };

  const signOut = async () => {
    try {
      await api.signout();
    } catch {
      /* empty */
    }

    tokenStore.clear();
    userStore.clear();
    setUserState(null);
  };

  return { user, loading, signOut, setUser };
}
