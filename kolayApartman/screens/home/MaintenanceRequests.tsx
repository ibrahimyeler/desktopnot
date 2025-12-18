import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

interface MaintenanceRequest {
  id: string;
  title: string;
  date: string;
  status: 'pending' | 'in-progress' | 'completed';
  category: string;
}

const MaintenanceRequests: React.FC = () => {
  const requests: MaintenanceRequest[] = [
    {
      id: '1',
      title: 'Musluk Tamiri',
      date: '7 Ekim 2025',
      status: 'in-progress',
      category: 'Sıhhi Tesisat',
    },
    {
      id: '2',
      title: 'Elektrik Arızası',
      date: '5 Ekim 2025',
      status: 'completed',
      category: 'Elektrik',
    },
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: 'Bekliyor', color: '#FF9800', bgColor: '#FFF3E0' };
      case 'in-progress':
        return { text: 'İşlemde', color: '#2196F3', bgColor: '#E3F2FD' };
      case 'completed':
        return { text: 'Tamamlandı', color: '#4CAF50', bgColor: '#E8F5E9' };
      default:
        return { text: 'Bilinmiyor', color: '#999', bgColor: '#F5F5F5' };
    }
  };

  const renderRequest = ({ item }: { item: MaintenanceRequest }) => {
    const statusInfo = getStatusInfo(item.status);
    
    return (
      <TouchableOpacity style={styles.requestCard}>
        <View style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔧</Text>
          </View>
          <View style={styles.requestInfo}>
            <Text style={styles.requestTitle}>{item.title}</Text>
            <Text style={styles.category}>{item.category}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bakım Taleplerim</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Yeni</Text>
        </TouchableOpacity>
      </View>
      
      {requests.length > 0 ? (
        <FlatList
          data={requests}
          renderItem={renderRequest}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyText}>Henüz bakım talebiniz yok</Text>
          <TouchableOpacity style={styles.createButton}>
            <Text style={styles.createButtonText}>İlk Talebi Oluştur</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#1a5490',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    gap: 12,
  },
  requestCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  requestInfo: {
    flex: 1,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#1a5490',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default MaintenanceRequests;

