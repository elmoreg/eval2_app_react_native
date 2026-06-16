import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTransactions } from '../../hooks/useTransactions';
import { colors } from '../../constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TransactionsScreen() {
  const { transactions, isLoading, deleteTransaction } = useTransactions();
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transacciones</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/(tabs)/transaction/new')}
        >
          <IconSymbol name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemMain}>
              <View style={[
                styles.iconContainer, 
                { backgroundColor: item.type === 'income' ? '#dcfce7' : '#fee2e2' }
              ]}>
                <IconSymbol 
                  name={item.type === 'income' ? 'arrow.down.left' : 'arrow.up.right'} 
                  size={20} 
                  color={item.type === 'income' ? '#166534' : '#991b1b'} 
                />
              </View>
              <View style={styles.details}>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.category}>{item.categoryName}</Text>
              </View>
            </View>
            
            <View style={styles.itemSide}>
              <Text style={[
                styles.amount,
                { color: item.type === 'income' ? '#16a34a' : '#dc2626' }
              ]}>
                {item.type === 'income' ? '+' : '-'} ${item.amount.toLocaleString()}
              </Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => router.push(`/(tabs)/transaction/${item.id}`)}
                >
                  <IconSymbol name="pencil" size={18} color={colors.muted} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteTransaction(item.id)}
                  style={styles.deleteAction}
                >
                  <IconSymbol name="trash" size={18} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No hay transacciones registradas.</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => router.push('/(tabs)/transaction/new')}
            >
              <Text style={styles.emptyButtonText}>Agregar mi primera transacción</Text>
            </TouchableOpacity>
          </View>
        }
        contentContainerStyle={styles.list}
      />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.tint,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: 20,
  },
  item: {
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  category: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  itemSide: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteAction: {
    marginLeft: 12,
  },
  empty: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.muted,
    marginBottom: 20,
  },
  emptyButton: {
    padding: 10,
  },
  emptyButtonText: {
    color: colors.tint,
    fontWeight: 'bold',
  },
});
