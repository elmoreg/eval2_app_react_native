export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: string; // ISO format
  categoryId: string;
}

export interface TransactionWithCategory extends Transaction {
  categoryName: string;
}
