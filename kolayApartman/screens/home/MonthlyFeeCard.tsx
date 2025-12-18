import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface MonthlyFeeCardProps {
  month?: string;
  amount?: number;
  dueDate?: string;
  isPaid?: boolean;
}

const MonthlyFeeCard: React.FC<MonthlyFeeCardProps> = ({
  month = 'Ekim 2025',
  amount = 1500,
  dueDate = '15 Ekim 2025',
  isPaid = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Aylık Aidat</Text>
        <View style={[styles.statusBadge, isPaid ? styles.paidBadge : styles.unpaidBadge]}>
          <Text style={[styles.statusText, isPaid ? styles.paidText : styles.unpaidText]}>
            {isPaid ? '✓ Ödendi' : '⚠ Bekliyor'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Dönem</Text>
          <Text style={styles.value}>{month}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Tutar</Text>
          <Text style={styles.amount}>₺{amount.toFixed(2)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Son Ödeme</Text>
          <Text style={styles.value}>{dueDate}</Text>
        </View>
      </View>

      {!isPaid && (
        <TouchableOpacity style={styles.payButton}>
          <Text style={styles.payButtonText}>Hemen Öde</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.detailsButton}>
        <Text style={styles.detailsButtonText}>Detayları Gör</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  paidBadge: {
    backgroundColor: '#E8F5E9',
  },
  unpaidBadge: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  paidText: {
    color: '#4CAF50',
  },
  unpaidText: {
    color: '#FF9800',
  },
  content: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  amount: {
    fontSize: 20,
    color: '#1a5490',
    fontWeight: 'bold',
  },
  payButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsButton: {
    borderWidth: 1,
    borderColor: '#1a5490',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  detailsButtonText: {
    color: '#1a5490',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MonthlyFeeCard;

