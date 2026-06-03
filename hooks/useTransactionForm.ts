import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { TransactionType } from '../types';

const transactionSchema = z.object({
  amount: z.coerce.number().positive('El monto debe ser un número positivo'),
  type: z.enum(['income', 'expense'] as const),
  description: z.string().min(3, 'La descripción debe tener al menos 3 caracteres'),
  categoryId: z.string().min(1, 'Debes seleccionar una categoría'),
  photoUri: z.string().optional(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

export function useTransactionForm(initialData?: Partial<TransactionFormData>) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: initialData?.amount || 0,
      type: initialData?.type || 'expense',
      description: initialData?.description || '',
      categoryId: initialData?.categoryId || '',
      photoUri: initialData?.photoUri,
      location: initialData?.location,
    },
  });

  return {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    reset,
    setValue,
    watch,
  };
}
