const PlaceholderImage = require('../Images/loadingscreenMDAYouth.jpg');

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';

const LoadingScreen = ({ navigation }) => {
  const [zoomAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(zoomAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(zoomAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.replace('WelcomeScreen')} // Use replace instead of navigate
    >
      <Animated.Image 
        source={PlaceholderImage} 
        style={[styles.image, { transform: [{ scale: zoomAnim }] }]}
        resizeMode="cover" 
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        width: '100%',
        height: '100%',
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    image: {
        width: '100%',
        height: '100%',
    }
});

export default LoadingScreen;