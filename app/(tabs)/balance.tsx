import React, { useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useTransactions } from '../../hooks/useTransactions';
import { colors } from '../../constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function BalanceScreen() {
  const { totals, balance, isLoading, refreshTransactions } = useTransactions();

  // Refresh data when screen gains focus, as suggested in tips
  useFocusEffect(
    useCallback(() => {
      refreshTransactions();
    }, [refreshTransactions])
  );

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
        <Text style={styles.title}>Mi Balance</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Balance Total</Text>
          <Text style={[
            styles.balanceAmount,
            { color: balance >= 0 ? '#16a34a' : '#dc2626' }
          ]}>
            ${balance.toLocaleString()}
          </Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.summaryCard, styles.incomeCard]}>
            <View style={styles.iconCircle}>
              <IconSymbol name="arrow.down.left" size={24} color="#166534" />
            </View>
            <Text style={styles.summaryLabel}>Ingresos</Text>
            <Text style={styles.incomeAmount}>
              +${totals.income.toLocaleString()}
            </Text>
          </View>

          <View style={[styles.summaryCard, styles.expenseCard]}>
            <View style={styles.iconCircle}>
              <IconSymbol name="arrow.up.right" size={24} color="#991b1b" />
            </View>
            <Text style={styles.summaryLabel}>Egresos</Text>
            <Text style={styles.expenseAmount}>
              -${totals.expense.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Resumen de Cuenta</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Transacciones registradas</Text>
            <Text style={styles.infoValue}>
              {/* Note: In a real app we'd get length from hook */}
              Cálculo automático
            </Text>
          </View>
          <Text style={styles.infoText}>
            Tus finanzas se actualizan automáticamente cada vez que agregas un movimiento en la pestaña de Transacciones.
          </Text>
        </View>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    padding: 20,
  },
  balanceCard: {
    backgroundColor: colors.surface,
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  balanceLabel: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.border,
  },
  incomeCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#16a34a',
  },
  expenseCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#dc2626',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 5,
  },
  incomeAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  infoSection: {
    marginTop: 10,
    padding: 20,
    backgroundColor: '#eff6ff',
    borderRadius: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    color: '#60a5fa',
  },
  infoValue: {
    fontWeight: '600',
    color: '#1e40af',
  },
  infoText: {
    fontSize: 13,
    color: '#3b82f6',
    lineHeight: 18,
  },
});
