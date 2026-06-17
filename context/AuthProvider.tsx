'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session, signIn, setSession } from '@/lib/auth';

interface AuthContextType {
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<Session | null>(null);

  useEffect(() => {
    // Try to restore session from sessionStorage
    const stored = sessionStorage.getItem('auth-session');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Session;
        setSessionState(parsed);
      } catch (e) {
        console.error('Failed to parse session from sessionStorage', e);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const user = await signIn(email, password);
    if (user) {
      const newSession = await setSession(user);
      setSessionState(newSession);
      sessionStorage.setItem('auth-session', JSON.stringify(newSession));
      return true;
    }
    return false;
  };

  const logout = () => {
    setSessionState(null);
    sessionStorage.removeItem('auth-session');
  };

  const value = {
    session,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}