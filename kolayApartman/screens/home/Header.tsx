import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface HeaderProps {
  userName?: string;
  apartmentName?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  userName = 'Kullanıcı',
  apartmentName = 'Güneş Apartmanı' 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.welcomeSection}>
        <Text style={styles.greeting}>Merhaba,</Text>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.apartmentName}>{apartmentName}</Text>
      </View>
      
      <TouchableOpacity style={styles.profileButton}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#1a5490',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  welcomeSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#e0e9f5',
    marginBottom: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  apartmentName: {
    fontSize: 13,
    color: '#a8c5e8',
    fontWeight: '500',
  },
  profileButton: {
    padding: 4,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a5490',
  },
});

export default Header;

