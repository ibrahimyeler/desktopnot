import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Animation complete, wait a bit then callback
      setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 1500);
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a5490" />
      
      {/* Logo Container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}>
        {/* Building Icon */}
        <View style={styles.buildingIcon}>
          <View style={styles.buildingBase}>
            <View style={styles.buildingRow}>
              <View style={styles.window} />
              <View style={styles.window} />
              <View style={styles.window} />
            </View>
            <View style={styles.buildingRow}>
              <View style={styles.window} />
              <View style={styles.window} />
              <View style={styles.window} />
            </View>
            <View style={styles.buildingRow}>
              <View style={styles.window} />
              <View style={styles.window} />
              <View style={styles.window} />
            </View>
            <View style={styles.door} />
          </View>
        </View>
      </Animated.View>

      {/* App Name */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}>
        <Text style={styles.appName}>Kolay Apartman</Text>
        <Text style={styles.tagline}>Apartman Yönetimi Artık Kolay</Text>
      </Animated.View>

      {/* Loading Indicator */}
      <Animated.View
        style={[
          styles.loadingContainer,
          {
            opacity: fadeAnim,
          },
        ]}>
        <View style={styles.loadingBar}>
          <Animated.View
            style={[
              styles.loadingProgress,
              {
                transform: [{ scaleX: fadeAnim }],
              },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a5490',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  buildingIcon: {
    width: 140,
    height: 140,
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buildingBase: {
    width: 90,
    height: 100,
    backgroundColor: '#2c6bb3',
    borderRadius: 8,
    alignItems: 'center',
    paddingTop: 8,
    position: 'relative',
  },
  buildingRow: {
    flexDirection: 'row',
    marginBottom: 6,
    gap: 8,
  },
  window: {
    width: 18,
    height: 16,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  door: {
    width: 28,
    height: 32,
    backgroundColor: '#fff',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    position: 'absolute',
    bottom: 0,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: '#e0e9f5',
    textAlign: 'center',
    fontWeight: '300',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    width: width * 0.6,
  },
  loadingBar: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    transformOrigin: 'left',
  },
});

export default SplashScreen;

