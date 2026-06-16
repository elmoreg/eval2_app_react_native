import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Controller } from 'react-hook-form';
import { useCategories } from '../../../hooks/useCategories';
import { useCategoryForm } from '../../../hooks/useCategoryForm';
import { colors } from '../../../constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function CategoryFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { categories, addCategory, updateCategory, isLoading } = useCategories();
  
  const isEditing = id !== 'new';
  const categoryToEdit = isEditing ? categories.find((c) => c.id === Number(id)) : null;

  const { control, handleSubmit, errors, reset } = useCategoryForm();

  useEffect(() => {
    if (categoryToEdit) {
      reset({ name: categoryToEdit.name });
    }
  }, [categoryToEdit, reset]);

  const onSubmit = async (data: { name: string }) => {
    if (isEditing && id) {
      await updateCategory(Number(id), data.name);
    } else {
      await addCategory(data.name);
    }
    router.back();
  };

  if (isLoading && isEditing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={colors.tint} />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nombre de la categoría</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Ej: Alimentación, Sueldo, etc."
            />
          )}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.saveButtonText}>Guardar Categoría</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  backText: {
    color: colors.tint,
    fontSize: 16,
    marginLeft: 5,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: colors.tint,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
