import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface ActionItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress?: () => void;
}

const QuickActions: React.FC = () => {
  const actions: ActionItem[] = [
    { id: '1', title: 'Aidat Öde', icon: '💳', color: '#4CAF50' },
    { id: '2', title: 'Duyurular', icon: '📢', color: '#FF9800' },
    { id: '3', title: 'Bakım Talebi', icon: '🔧', color: '#2196F3' },
    { id: '4', title: 'Kat Toplantısı', icon: '👥', color: '#9C27B0' },
    { id: '5', title: 'Ödemeler', icon: '💰', color: '#F44336' },
    { id: '6', title: 'Belgeler', icon: '📄', color: '#607D8B' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hızlı İşlemler</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.actionsContainer}
      >
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionCard, { borderLeftColor: action.color }]}
            onPress={action.onPress}
          >
            <View style={[styles.iconContainer, { backgroundColor: action.color + '20' }]}>
              <Text style={styles.icon}>{action.icon}</Text>
            </View>
            <Text style={styles.actionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  actionsContainer: {
    gap: 12,
  },
  actionCard: {
    width: 100,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderLeftWidth: 4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
  },
  actionTitle: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default QuickActions;

