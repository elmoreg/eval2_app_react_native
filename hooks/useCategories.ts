import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Category } from '../types';
import { api } from '../services/api';
import { useAuth } from './useAuth';

export function useCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.categories.list(token);
      const mapped: Category[] = data.map((c: any) => ({
        id: c.id,
        name: c.name,
      }));
      setCategories(mapped);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [loadCategories])
  );

  return {
    categories,
    isLoading,
    error,
    refreshCategories: loadCategories,
  };
}
