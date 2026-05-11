import { useState, useCallback, useEffect } from 'react';
import { Category } from '../types';
import { storage } from '../lib/storage';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await storage.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addCategory = async (name: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
    };
    const updated = [...categories, newCategory];
    await storage.saveCategories(updated);
    setCategories(updated);
  };

  const updateCategory = async (id: string, name: string) => {
    const updated = categories.map((c) => (c.id === id ? { ...c, name } : c));
    await storage.saveCategories(updated);
    setCategories(updated);
  };

  const deleteCategory = async (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    await storage.saveCategories(updated);
    setCategories(updated);
  };

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    categories,
    isLoading,
    refreshCategories: loadCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
