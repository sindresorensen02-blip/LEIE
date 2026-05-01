import { getSupabase } from '../lib/supabase';
import { Profile, UserRole } from '../types';

export interface AuthSession {
  userId: string;
  email: string | null;
}

const mapRowToProfile = (row: any, fallbackEmail: string): Profile => ({
  id: row.id,
  email: row.email ?? fallbackEmail,
  fullName: row.full_name ?? null,
  role: (row.role ?? 'user') as UserRole,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const authService = {
  async getSession(): Promise<AuthSession | null> {
    const sb = getSupabase();
    if (!sb) return null;
    const { data } = await sb.auth.getSession();
    const session = data.session;
    if (!session?.user) return null;
    return { userId: session.user.id, email: session.user.email ?? null };
  },

  async signInWithEmail(email: string, password: string): Promise<AuthSession> {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase er ikke konfigurert');
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error || !data.user) throw new Error(error?.message ?? 'Kunne ikke logge inn');
    return { userId: data.user.id, email: data.user.email ?? null };
  },

  async signUpWithEmail(email: string, password: string): Promise<AuthSession> {
    const sb = getSupabase();
    if (!sb) throw new Error('Supabase er ikke konfigurert');
    const { data, error } = await sb.auth.signUp({ email, password });
    if (error || !data.user) throw new Error(error?.message ?? 'Kunne ikke opprette konto');
    return { userId: data.user.id, email: data.user.email ?? null };
  },

  async signOut(): Promise<void> {
    const sb = getSupabase();
    if (!sb) return;
    await sb.auth.signOut();
  },

  async getProfile(userId: string, fallbackEmail = ''): Promise<Profile | null> {
    const sb = getSupabase();
    if (!sb) return null;
    const { data, error } = await sb
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error || !data) return null;
    return mapRowToProfile(data, fallbackEmail);
  },

  onAuthStateChange(cb: (session: AuthSession | null) => void): () => void {
    const sb = getSupabase();
    if (!sb) return () => undefined;
    const { data } = sb.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        cb(null);
      } else {
        cb({ userId: session.user.id, email: session.user.email ?? null });
      }
    });
    return () => data.subscription.unsubscribe();
  },
};
