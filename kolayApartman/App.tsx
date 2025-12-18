/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  // Show splash screen first
  if (showSplash) {
    return (
      <SplashScreen 
        onAnimationComplete={() => setShowSplash(false)} 
      />
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <HomeScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
