import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fontSize, spacing } from '../utils/responsive';

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);

  useEffect(() => {
    // Анимация появления
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Переход к регистрации через 2.5 секунды
    const timer = setTimeout(() => {
      navigation.navigate('Auth' as never);
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.logo}>💕</Text>
        <Text style={styles.title}>SWIPE</Text>
        <Text style={styles.subtitle}>Найди свою любовь</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: fontSize.huge * 2.5,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.huge * 1.5,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: spacing.sm,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: fontSize.xl,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '300',
  },
});
