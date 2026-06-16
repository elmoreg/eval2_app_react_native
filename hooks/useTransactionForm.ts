import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const transactionSchema = z.object({
  // amount se maneja como string mientras se escribe y se convierte al guardar
  amount: z.union([z.string(), z.number()]).refine((val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  }, 'El monto debe ser un número positivo'),
  type: z.enum(['income', 'expense'] as const),
  description: z.string().min(3, 'La descripción debe tener al menos 3 caracteres'),
  // categoryId ahora es number (Prisma Int)
  categoryId: z.number({ required_error: 'Debes seleccionar una categoría' }).positive('Debes seleccionar una categoría'),
  // Campos de hardware — se guardan temporalmente como URI local
  // el hook useTransactions se encarga de subir la foto y mapear al servidor
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
      categoryId: initialData?.categoryId as number | undefined,
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
