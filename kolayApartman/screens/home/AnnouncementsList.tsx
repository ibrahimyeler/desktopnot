import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

interface Announcement {
  id: string;
  title: string;
  date: string;
  preview: string;
  isImportant?: boolean;
}

const AnnouncementsList: React.FC = () => {
  const announcements: Announcement[] = [
    {
      id: '1',
      title: 'Su Kesintisi Duyurusu',
      date: '8 Ekim 2025',
      preview: 'Yarın saat 09:00-12:00 arası su kesintisi olacaktır.',
      isImportant: true,
    },
    {
      id: '2',
      title: 'Kat Toplantısı',
      date: '5 Ekim 2025',
      preview: '15 Ekim Pazar günü saat 14:00\'te kat toplantısı yapılacaktır.',
      isImportant: false,
    },
    {
      id: '3',
      title: 'Asansör Bakımı',
      date: '3 Ekim 2025',
      preview: 'Asansörlerin yıllık bakımları tamamlanmıştır.',
      isImportant: false,
    },
  ];

  const renderAnnouncement = ({ item }: { item: Announcement }) => (
    <TouchableOpacity style={styles.announcementCard}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          {item.isImportant && (
            <View style={styles.importantBadge}>
              <Text style={styles.importantText}>Önemli</Text>
            </View>
          )}
          <Text style={styles.announcementTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <Text style={styles.preview} numberOfLines={2}>
        {item.preview}
      </Text>
      <Text style={styles.readMore}>Devamını Oku →</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Duyurular</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>Tümünü Gör</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={announcements}
        renderItem={renderAnnouncement}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
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
  seeAll: {
    fontSize: 14,
    color: '#1a5490',
    fontWeight: '600',
  },
  listContainer: {
    gap: 12,
  },
  announcementCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    gap: 6,
  },
  importantBadge: {
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  importantText: {
    fontSize: 10,
    color: '#F44336',
    fontWeight: 'bold',
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  preview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  readMore: {
    fontSize: 13,
    color: '#1a5490',
    fontWeight: '600',
  },
});

export default AnnouncementsList;

