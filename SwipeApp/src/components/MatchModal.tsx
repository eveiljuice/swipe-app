import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Image,
  Dimensions,
} from 'react-native';
import { User } from '../data/mockData';
import { 
  fontSize, 
  spacing, 
  getAdaptiveStyles,
  deviceSizes,
  wp,
  hp 
} from '../utils/responsive';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const adaptiveStyles = getAdaptiveStyles();

interface MatchModalProps {
  visible: boolean;
  user: User;
  onClose: () => void;
  onChat: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({ 
  visible, 
  user, 
  onClose, 
  onChat 
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const heartAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Анимация появления модального окна
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Анимация сердечек
      Animated.loop(
        Animated.sequence([
          Animated.timing(heartAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(heartAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
      heartAnim.setValue(0);
    }
  }, [visible]);

  const heartScale = heartAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 1],
  });

  const heartOpacity = heartAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.7, 1, 0.7],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.container,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            }
          ]}
        >
          {/* Анимированные сердечки в фоне */}
          <Animated.View 
            style={[
              styles.heartBackground,
              {
                opacity: heartOpacity,
                transform: [{ scale: heartScale }],
              }
            ]}
          >
            <Text style={styles.heartEmoji}>💕</Text>
          </Animated.View>

          {/* Основной контент */}
          <View style={styles.content}>
            <Text style={styles.title}>Это взаимно!</Text>
            
            <View style={styles.userInfo}>
              <Image 
                source={typeof user.photos[0] === 'string' ? { uri: user.photos[0] } : user.photos[0]} 
                style={styles.userPhoto}
              />
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.matchText}>
                Вы понравились друг другу! 🎉
              </Text>
            </View>

            <View style={styles.buttons}>
              <TouchableOpacity 
                style={[styles.button, styles.laterButton]} 
                onPress={onClose}
              >
                <Text style={styles.laterButtonText}>Позже</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.chatButton]} 
                onPress={onChat}
              >
                <Text style={styles.chatButtonText}>Написать 💬</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: wp(85),
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: deviceSizes.borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  heartBackground: {
    position: 'absolute',
    top: -spacing.xl,
    right: -spacing.lg,
    zIndex: 0,
  },
  heartEmoji: {
    fontSize: fontSize.huge * 3,
    opacity: 0.1,
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  userPhoto: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    marginBottom: spacing.md,
    borderWidth: 3,
    borderColor: '#FF6B6B',
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  matchText: {
    fontSize: fontSize.md,
    color: '#666',
    textAlign: 'center',
    lineHeight: fontSize.md * 1.4,
  },
  buttons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: deviceSizes.borderRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: adaptiveStyles.buttonSize * 0.8,
  },
  laterButton: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  laterButtonText: {
    fontSize: fontSize.md,
    color: '#666',
    fontWeight: '600',
  },
  chatButton: {
    backgroundColor: '#FF6B6B',
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  chatButtonText: {
    fontSize: fontSize.md,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
