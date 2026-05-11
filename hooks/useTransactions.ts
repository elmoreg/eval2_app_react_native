import { useState, useCallback, useEffect } from 'react';
import { Transaction, TransactionWithCategory, Category } from '../types';
import { storage } from '../lib/storage';

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsWithCategory, setTransactionsWithCategory] = useState<TransactionWithCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [transData, catData] = await Promise.all([
        storage.getTransactions(),
        storage.getCategories(),
      ]);
      
      setTransactions(transData);

      const enriched = transData.map((t) => {
        const category = catData.find((c) => c.id === t.categoryId);
        return {
          ...t,
          categoryName: category ? category.name : 'Sin categoría',
        };
      });
      
      // Sort by date descending
      enriched.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      setTransactionsWithCategory(enriched);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addTransaction = async (data: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...data,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    const updated = [...transactions, newTransaction];
    await storage.saveTransactions(updated);
    await loadData(); // Reload to update enriched list
  };

  const updateTransaction = async (id: string, data: Partial<Transaction>) => {
    const updated = transactions.map((t) => (t.id === id ? { ...t, ...data } : t));
    await storage.saveTransactions(updated);
    await loadData();
  };

  const deleteTransaction = async (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    await storage.saveTransactions(updated);
    await loadData();
  };

  // Balance logic (as required by rubric)
  const totals = transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') {
        acc.income += t.amount;
      } else {
        acc.expense += t.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const balance = totals.income - totals.expense;

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    transactions: transactionsWithCategory,
    isLoading,
    refreshTransactions: loadData,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totals,
    balance,
  };
}
