import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const categorySchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export function useCategoryForm(initialData?: CategoryFormData) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: initialData || {
      name: '',
    },
  });

  return {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    reset,
  };
}
