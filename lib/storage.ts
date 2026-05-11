import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category, Transaction } from '../types';

const CATEGORIES_KEY = 'categories';
const TRANSACTIONS_KEY = 'transactions';

export const storage = {
  // Categories
  async getCategories(): Promise<Category[]> {
    const data = await AsyncStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : [];
  },

  async saveCategories(categories: Category[]): Promise<void> {
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  },

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    const data = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  },

  async saveTransactions(transactions: Transaction[]): Promise<void> {
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  },

  // Auth (Mock)
  async setAuth(isAuth: boolean): Promise<void> {
    await AsyncStorage.setItem('isAuth', JSON.stringify(isAuth));
  },

  async getAuth(): Promise<boolean> {
    const data = await AsyncStorage.getItem('isAuth');
    return data ? JSON.parse(data) : false;
  }
};
