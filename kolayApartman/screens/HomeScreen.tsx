import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Home Components
import Header from './home/Header';
import QuickActions from './home/QuickActions';
import MonthlyFeeCard from './home/MonthlyFeeCard';
import AnnouncementsList from './home/AnnouncementsList';
import MaintenanceRequests from './home/MaintenanceRequests';

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#1a5490" />
      <View style={styles.container}>
        {/* Header - Kullanıcı bilgileri */}
        <Header 
          userName="ibrahim yeler" 
          apartmentName="Apartman adi - Daire no"
        />

        {/* Scrollable Content */}
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Quick Actions - Hızlı erişim butonları */}
          <QuickActions />

          {/* Monthly Fee Card - Aidat bilgisi */}
          <MonthlyFeeCard
            month="Ekim 2025"
            amount={1500}
            dueDate="15 Ekim 2025"
            isPaid={false}
          />

          {/* Announcements List - Duyurular */}
          <AnnouncementsList />

          {/* Maintenance Requests - Bakım talepleri */}
          <MaintenanceRequests />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a5490',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
});

export default HomeScreen;

