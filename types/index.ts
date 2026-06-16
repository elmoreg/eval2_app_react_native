export type TransactionType = 'income' | 'expense';

export interface Category {
  id: number;
  name: string;
}

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  description: string;
  date: string; // ISO format
  categoryId: number;
  // Campos de hardware (Evaluación 3, ahora persisten en el servidor)
  receiptUrl?: string;   // URL pública devuelta por la API tras upload
  latitude?: number;
  longitude?: number;
}

export interface TransactionWithCategory extends Transaction {
  categoryName: string;
}
