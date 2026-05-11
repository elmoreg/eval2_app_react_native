import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { storage } from '../lib/storage';

const VALID_EMAIL = 'admin@cashi.com';
const VALID_PASSWORD = 'admin123';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const auth = await storage.getAuth();
      setIsAuthenticated(auth);
    };
    checkAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    setError(null);
    if (email === VALID_EMAIL && pass === VALID_PASSWORD) {
      await storage.setAuth(true);
      setIsAuthenticated(true);
      router.replace('/(tabs)');
      return true;
    } else {
      setError('Credenciales incorrectas. Intente nuevamente.');
      return false;
    }
  };

  const logout = async () => {
    await storage.setAuth(false);
    setIsAuthenticated(false);
    router.replace('/');
  };

  return {
    isAuthenticated,
    login,
    logout,
    error,
  };
}
