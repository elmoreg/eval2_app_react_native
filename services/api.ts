import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'cashi_jwt_token';

// Ajusta esta URL a la de la API. Para desarrollo local con Expo Go en el mismo Mac:
// iOS Simulator: http://localhost:3000
// Android Emulator: http://10.0.2.2:3000
// Dispositivo físico en la misma red: http://192.168.X.X:3000
export const API_BASE_URL = 'https://eva2-api-cashi.onrender.com';

// ─── Token helpers ────────────────────────────────────────────────────────────

export async function saveToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

// ─── HTTP helper ──────────────────────────────────────────────────────────────

type ApiOptions = Omit<RequestInit, 'headers'> & { token?: string | null };

async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { ...fetchOptions, headers });
  } catch {
    throw new Error('Error de conexión');
  }

  if (!res.ok) {
    let body: any = {};
    try { body = await res.json(); } catch {}
    throw new Error(body?.error ?? `Error ${res.status}`);
  }

  // 204 No Content → return empty object
  if (res.status === 204) return {} as T;
  return res.json();
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const api = {
  auth: {
    login: (email: string, password: string) =>
      apiFetch<{ token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    register: (email: string, password: string) =>
      apiFetch<{ token: string }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
  },

  // ─── Transactions ───────────────────────────────────────────────────────────

  transactions: {
    list: (token: string) =>
      apiFetch<any[]>('/transactions', { token }),

    getById: (id: number, token: string) =>
      apiFetch<any>(`/transactions/${id}`, { token }),

    create: (data: CreateTransactionPayload, token: string) =>
      apiFetch<any>('/transactions', {
        method: 'POST',
        body: JSON.stringify(data),
        token,
      }),

    update: (id: number, data: Partial<CreateTransactionPayload>, token: string) =>
      apiFetch<any>(`/transactions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
        token,
      }),

    delete: (id: number, token: string) =>
      apiFetch<any>(`/transactions/${id}`, { method: 'DELETE', token }),

    balance: (token: string) =>
      apiFetch<{ totalIncome: number; totalExpense: number; balance: number }>(
        '/transactions/balance',
        { token }
      ),

    uploadReceipt: async (photoUri: string, token: string): Promise<string> => {
      const formData = new FormData();
      const filename = photoUri.split('/').pop() ?? 'receipt.jpg';
      const ext = filename.split('.').pop()?.toLowerCase();
      const mimeType =
        ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';

      formData.append('receipt', {
        uri: photoUri,
        name: filename,
        type: mimeType,
      } as any);

      let res: Response;
      try {
        res = await fetch(`${API_BASE_URL}/transactions/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
      } catch {
        throw new Error('Error de conexión');
      }

      if (!res.ok) {
        let body: any = {};
        try { body = await res.json(); } catch {}
        throw new Error(body?.error ?? `Error ${res.status}`);
      }

      const json = await res.json();
      // El controller devuelve { receiptUrl }
      return json.receiptUrl as string;
    },
  },

  // ─── Categories ─────────────────────────────────────────────────────────────

  categories: {
    list: (token: string) =>
      apiFetch<any[]>('/categories', { token }),

    create: (name: string, token: string) =>
      apiFetch<any>('/categories', {
        method: 'POST',
        body: JSON.stringify({ name }),
        token,
      }),

    update: (id: number, name: string, token: string) =>
      apiFetch<any>(`/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name }),
        token,
      }),

    delete: (id: number, token: string) =>
      apiFetch<any>(`/categories/${id}`, { method: 'DELETE', token }),
  },
};

// ─── Types for API payloads ───────────────────────────────────────────────────

export interface CreateTransactionPayload {
  amount: number;
  type: 'income' | 'expense';
  description?: string;
  date: string;
  categoryId: number;
  receiptUrl?: string;
  latitude?: number;
  longitude?: number;
}
