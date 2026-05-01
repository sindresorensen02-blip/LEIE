import { createContext, useContext } from 'react';
import { AuthSession } from '../services/authService';
import { Profile } from '../types';

export interface AuthState {
  session: AuthSession | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthState>({
  session: null,
  profile: null,
  loading: false,
  signIn: async () => undefined,
  signUp: async () => undefined,
  signOut: async () => undefined,
});

export const useAuth = () => useContext(AuthContext);
