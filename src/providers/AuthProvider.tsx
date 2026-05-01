import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { authService, AuthSession } from '../services/authService';
import { isSupabaseConfigured } from '../lib/config';
import { Profile } from '../types';
import { AuthContext } from '../hooks/useAuth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!isSupabaseConfigured) {
        if (mounted) setLoading(false);
        return;
      }
      try {
        const s = await authService.getSession();
        if (!mounted) return;
        setSession(s);
        if (s) {
          const p = await authService.getProfile(s.userId, s.email ?? '');
          if (mounted) setProfile(p);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const unsub = authService.onAuthStateChange(async (s) => {
      setSession(s);
      if (s) {
        const p = await authService.getProfile(s.userId, s.email ?? '');
        setProfile(p);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const s = await authService.signInWithEmail(email, password);
    setSession(s);
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    const s = await authService.signUpWithEmail(email, password);
    setSession(s);
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    setSession(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({ session, profile, loading, signIn, signUp, signOut }),
    [session, profile, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
