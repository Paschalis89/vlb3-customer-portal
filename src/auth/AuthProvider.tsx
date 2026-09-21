import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getCurrentUser, login as loginRequest, logout as logoutRequest } from '../api/auth';
import { appConfig } from '../config/app';
import { clearDemoSession, readDemoSession, writeDemoSession } from '../demo/session';
import type { AuthUser, LoginCredentials } from '../types/auth';
import { AuthContext, type AuthContextValue } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        if (appConfig.demoMode) {
          if (active) {
            setUser(readDemoSession());
          }
          return;
        }

        const currentUser = await getCurrentUser();
        if (active) {
          setUser(currentUser);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setIsInitializing(false);
        }
      }
    }

    void restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsSubmitting(true);

    try {
      const result = await loginRequest(credentials);
      setUser(result.user);

      if (appConfig.demoMode) {
        writeDemoSession(result.user);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsSubmitting(true);

    try {
      await logoutRequest();
    } finally {
      if (appConfig.demoMode) {
        clearDemoSession();
      }

      setUser(null);
      setIsSubmitting(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isInitializing,
      isSubmitting,
      login,
      logout,
    }),
    [isInitializing, isSubmitting, login, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
