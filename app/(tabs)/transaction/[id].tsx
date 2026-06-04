import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Controller } from 'react-hook-form';
import { useTransactions } from '../../../hooks/useTransactions';
import { useCategories } from '../../../hooks/useCategories';
import { useTransactionForm, TransactionFormData } from '../../../hooks/useTransactionForm';
import { useImagePicker } from '../../../hooks/useImagePicker';
import { useLocation } from '../../../hooks/useLocation';
import { colors } from '../../../constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TransactionFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  
  const { transactions, addTransaction, updateTransaction, isLoading: loadingTrans } = useTransactions();
  const { categories, isLoading: loadingCats } = useCategories();
  
  const isEditing = id !== 'new';
  const transactionToEdit = isEditing ? transactions.find((t) => t.id === id) : null;

  const { control, handleSubmit, errors, reset, setValue } = useTransactionForm();
  
  const { takePhoto: takePhotoHook, pickFromGallery: pickFromGalleryHook, error: imageError } = useImagePicker();
  const { getLocation: getLocationHook, error: locationError } = useLocation();

  useEffect(() => {
    if (transactionToEdit) {
      reset({
        amount: transactionToEdit.amount,
        type: transactionToEdit.type,
        description: transactionToEdit.description,
        categoryId: transactionToEdit.categoryId,
        photoUri: transactionToEdit.photoUri,
        location: transactionToEdit.location,
      });
    } else {
      reset({
        amount: 0,
        type: 'expense',
        description: '',
        categoryId: '',
        photoUri: undefined,
        location: undefined,
      });
    }
  }, [transactionToEdit, reset]);

  
  const onSubmit = async (data: TransactionFormData) => {
    if (isEditing && id) {
      await updateTransaction(id, data);
    } else {
      await addTransaction(data);
    }
    router.back();
  };

  if ((loadingTrans || loadingCats) && isEditing) {
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
          {isEditing ? 'Editar Transacción' : 'Nueva Transacción'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Tipo de movimiento</Text>
        <Controller
          control={control}
          name="type"
          render={({ field: { value } }) => (
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  value === 'expense' && styles.typeButtonExpense,
                ]}
                onPress={() => setValue('type', 'expense', { shouldValidate: true, shouldDirty: true })}
              >
                <Text style={[styles.typeButtonText, value === 'expense' && styles.typeButtonTextActive]}>
                  Egreso
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  value === 'income' && styles.typeButtonIncome,
                ]}
                onPress={() => setValue('type', 'income', { shouldValidate: true, shouldDirty: true })}
              >
                <Text style={[styles.typeButtonText, value === 'income' && styles.typeButtonTextActive]}>
                  Ingreso
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <Text style={styles.label}>Monto</Text>
        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.amount && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value?.toString()}
              placeholder="0.00"
              keyboardType="numeric"
            />
          )}
        />
        {errors.amount && <Text style={styles.errorText}>{errors.amount.message}</Text>}

        <Text style={styles.label}>Descripción</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.description && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="¿En qué se gastó o de dónde vino?"
            />
          )}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description.message}</Text>}

        <Text style={styles.label}>Categoría</Text>
        <Controller
          control={control}
          name="categoryId"
          render={({ field: { value } }) => (
            <View style={styles.categoriesGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryChip,
                    value === cat.id && styles.categoryChipActive,
                  ]}
                  onPress={() => setValue('categoryId', cat.id, { shouldValidate: true, shouldDirty: true })}
                >
                  <Text style={[
                    styles.categoryChipText,
                    value === cat.id && styles.categoryChipTextActive
                  ]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
              {categories.length === 0 && (
                <Text style={styles.noCategories}>
                  No hay categorías. Crea una primero en la pestaña de Categorías.
                </Text>
              )}
            </View>
          )}
        />
        {errors.categoryId && <Text style={styles.errorText}>{errors.categoryId.message}</Text>}

        <Text style={styles.label}>Comprobante (opcional)</Text>
        <Controller
          control={control}
          name="photoUri"
          render={({ field: { onChange, value } }) => (
            <>
              {value && (
                <Image 
                  source={{ uri: value }} 
                  style={styles.photoPreview} 
                  contentFit="cover" 
                />
              )}
              {imageError && <Text style={styles.hardwareError}>{imageError}</Text>}
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.flexButton]} 
                  onPress={async () => {
                    const uri = await takePhotoHook();
                    if (uri) onChange(uri);
                  }}
                >
                  <IconSymbol name="camera" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Tomar Foto</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.flexButton]} 
                  onPress={async () => {
                    const uri = await pickFromGalleryHook();
                    if (uri) onChange(uri);
                  }}
                >
                  <IconSymbol name="photo" size={20} color="#fff" />
                  <Text style={styles.actionButtonText}>Galería</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        />

        <Text style={styles.label}>Ubicación (opcional)</Text>
        <Controller
          control={control}
          name="location"
          render={({ field: { onChange, value } }) => (
            <>
              {value && (
                <Text style={styles.locationText}>
                  Lat: {value.latitude.toFixed(4)}, Lon: {value.longitude.toFixed(4)}
                </Text>
              )}
              {locationError && <Text style={styles.hardwareError}>{locationError}</Text>}
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={async () => {
                  const coords = await getLocationHook();
                  if (coords) onChange(coords);
                }}
              >
                <IconSymbol name="location.fill" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Registrar Ubicación</Text>
              </TouchableOpacity>
            </>
          )}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSubmit(onSubmit)}
          disabled={categories.length === 0}
        >
          <Text style={styles.saveButtonText}>Guardar Transacción</Text>
        </TouchableOpacity>
      </ScrollView>
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
    marginTop: 15,
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonIncome: {
    backgroundColor: '#dcfce7',
  },
  typeButtonExpense: {
    backgroundColor: '#fee2e2',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.muted,
  },
  typeButtonTextActive: {
    color: colors.text,
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
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.tint,
    borderColor: colors.tint,
  },
  categoryChipText: {
    color: colors.text,
  },
  categoryChipTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noCategories: {
    color: colors.danger,
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: colors.tint,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  flexButton: {
    flex: 1,
    marginTop: 0,
  },
  actionButton: {
    backgroundColor: colors.tint,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  locationText: {
    color: colors.text,
    fontStyle: 'italic',
    marginTop: 5,
  },
  hardwareError: {
    color: colors.danger,
    fontSize: 14,
    marginTop: 5,
    fontStyle: 'italic',
  },
});
