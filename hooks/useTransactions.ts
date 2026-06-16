import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { Transaction, TransactionWithCategory } from '../types';
import { api } from '../services/api';
import { useAuth } from './useAuth';

export function useTransactions() {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsWithCategory, setTransactionsWithCategory] = useState<TransactionWithCategory[]>([]);
  const [totals, setTotals] = useState({ income: 0, expense: 0 });
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!token) {
      setTransactions([]);
      setTransactionsWithCategory([]);
      setTotals({ income: 0, expense: 0 });
      setBalance(0);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const [rawTx, balanceData] = await Promise.all([
        api.transactions.list(token),
        api.transactions.balance(token),
      ]);

      const mapped: Transaction[] = rawTx.map((t: any) => ({
        id: t.id,
        amount: t.amount,
        type: t.type,
        description: t.description ?? '',
        date: typeof t.date === 'string' ? t.date : new Date(t.date).toISOString(),
        categoryId: t.categoryId,
        receiptUrl: t.receiptUrl ?? undefined,
        latitude: t.latitude ?? undefined,
        longitude: t.longitude ?? undefined,
      }));

      setTransactions(mapped);

      const enriched: TransactionWithCategory[] = mapped.map((t) => ({
        ...t,
        categoryName: rawTx.find((r: any) => r.id === t.id)?.category?.name ?? 'Sin categoría',
      }));

      // Sort by date descending
      enriched.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactionsWithCategory(enriched);

      setTotals({ income: balanceData.totalIncome, expense: balanceData.totalExpense });
      setBalance(balanceData.balance);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const addTransaction = async (data: {
    amount: number;
    type: 'income' | 'expense';
    description?: string;
    categoryId: number;
    photoUri?: string;
    location?: { latitude: number; longitude: number };
  }) => {
    if (!token) return;

    let receiptUrl: string | undefined;
    if (data.photoUri) {
      try {
        receiptUrl = await api.transactions.uploadReceipt(data.photoUri, token);
      } catch {
        // Si falla el upload, continuar sin foto
        receiptUrl = undefined;
      }
    }

    await api.transactions.create(
      {
        amount: data.amount,
        type: data.type,
        description: data.description,
        date: new Date().toISOString(),
        categoryId: data.categoryId,
        receiptUrl,
        latitude: data.location?.latitude,
        longitude: data.location?.longitude,
      },
      token
    );
    await loadData();
  };

  const updateTransaction = async (
    id: number,
    data: {
      amount?: number;
      type?: 'income' | 'expense';
      description?: string;
      categoryId?: number;
      photoUri?: string;
      location?: { latitude: number; longitude: number };
    }
  ) => {
    if (!token) return;

    let receiptUrl: string | undefined;
    if (data.photoUri) {
      try {
        receiptUrl = await api.transactions.uploadReceipt(data.photoUri, token);
      } catch {
        receiptUrl = undefined;
      }
    }

    await api.transactions.update(
      id,
      {
        ...(data.amount !== undefined && { amount: data.amount }),
        ...(data.type && { type: data.type }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        ...(receiptUrl && { receiptUrl }),
        ...(data.location && {
          latitude: data.location.latitude,
          longitude: data.location.longitude,
        }),
      },
      token
    );
    await loadData();
  };

  const deleteTransaction = async (id: number) => {
    if (!token) return;
    await api.transactions.delete(id, token);
    await loadData();
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  return {
    transactions: transactionsWithCategory,
    isLoading,
    error,
    refreshTransactions: loadData,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totals,
    balance,
  };
}
