import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { api, saveToken, getToken, deleteToken } from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthState {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    token: null,
    email: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Al montar, verificar si hay token guardado en SecureStore
  useEffect(() => {
    (async () => {
      try {
        const stored = await getToken();
        if (stored) {
          // Decodificar el email del payload sin verificar firma (solo lectura)
          const payload = JSON.parse(atob(stored.split('.')[1]));
          setState({
            token: stored,
            email: payload.email ?? null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState((s) => ({ ...s, isLoading: false }));
        }
      } catch {
        setState((s) => ({ ...s, isLoading: false }));
      }
    })();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setState((s) => ({ ...s, error: null }));
    try {
      const { token } = await api.auth.login(email, password);
      await saveToken(token);
      setState({
        token,
        email,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      router.replace('/(tabs)');
      return true;
    } catch (err: any) {
      setState((s) => ({ ...s, error: err.message }));
      return false;
    }
  };

  const register = async (email: string, password: string): Promise<boolean> => {
    setState((s) => ({ ...s, error: null }));
    try {
      const { token } = await api.auth.register(email, password);
      await saveToken(token);
      setState({
        token,
        email,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      router.replace('/(tabs)');
      return true;
    } catch (err: any) {
      setState((s) => ({ ...s, error: err.message }));
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    await deleteToken();
    setState({
      token: null,
      email: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    router.replace('/');
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext debe usarse dentro de <AuthProvider>');
  return ctx;
}
