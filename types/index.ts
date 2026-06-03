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
  // ── Nuevo en Evaluación 3 ──────────────────────────────
  photoUri?: string; // URI local de la foto del comprobante
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface TransactionWithCategory extends Transaction {
  categoryName: string;
}
