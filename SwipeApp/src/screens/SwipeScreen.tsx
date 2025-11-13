import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Alert,
} from 'react-native';
import { TouchableOpacity, PanGestureHandler, State } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { UserCard, MatchModal } from '../components';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { Colors, Shadows, Glass } from '../utils/colors';
import { 
  screenDimensions, 
  deviceSizes, 
  fontSize, 
  spacing, 
  getAdaptiveStyles,
  wp,
  hp 
} from '../utils/responsive';

const SWIPE_THRESHOLD = screenDimensions.width * 0.3;
const adaptiveStyles = getAdaptiveStyles();

export const SwipeScreen: React.FC = () => {
  const { state, swipeLeft, swipeRight } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState<any>(null);
  const navigation = useNavigation<any>();
  
  // Состояние для отслеживания показа модального окна "Это взаимно!" в текущей сессии
  const [hasShownMatchThisSession, setHasShownMatchThisSession] = useState(false);
  
  // Вероятность показа модального окна при лайке (20% шанс)
  const MATCH_PROBABILITY = 0.2;
  
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const currentUser = state.users[currentIndex];

  // Обработчики для модального окна мэтча
  const handleMatchClose = () => {
    setShowMatchModal(false);
    setMatchedUser(null);
  };

  const handleMatchChat = () => {
    setShowMatchModal(false);
    setMatchedUser(null);
    if (matchedUser) {
      navigation.navigate('Chat' as never, { user: matchedUser } as never);
    }
  };

  // Функция для сброса состояния сессии (можно вызывать при обновлении списка пользователей)
  const resetMatchSession = () => {
    setHasShownMatchThisSession(false);
  };

  const resetCard = () => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.spring(rotate, {
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentUser) return;

    const toValue = direction === 'right' ? screenDimensions.width : -screenDimensions.width;
    
    Animated.parallel([
      Animated.timing(translateX, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (direction === 'right') {
        swipeRight(currentUser.id);
        
        // Логика показа модального окна "Это взаимно!" - случайно один раз за сессию
        if (!hasShownMatchThisSession && Math.random() < MATCH_PROBABILITY) {
          setMatchedUser(currentUser);
          setShowMatchModal(true);
          setHasShownMatchThisSession(true); // Помечаем, что уже показали в этой сессии
        }
      } else {
        swipeLeft(currentUser.id);
      }
      
      setCurrentIndex(prev => prev + 1);
      resetCard();
    });
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX } = event.nativeEvent;
      
      if (Math.abs(translationX) > SWIPE_THRESHOLD) {
        handleSwipe(translationX > 0 ? 'right' : 'left');
      } else {
        resetCard();
      }
    }
  };

  const rotateInterpolate = rotate.interpolate({
    inputRange: [-screenDimensions.width, 0, screenDimensions.width],
    outputRange: ['-30deg', '0deg', '30deg'],
    extrapolate: 'clamp',
  });

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>🎉</Text>
          <Text style={styles.emptyText}>
            Вы просмотрели всех пользователей в вашем районе!
          </Text>
          <Text style={styles.emptySubtext}>
            Попробуйте расширить радиус поиска или зайдите позже
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient
      colors={[Colors.gray[50], Colors.gray[100], Colors.pink[50]]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Современный хедер */}
        <View style={styles.header}>
          <LinearGradient
            colors={[Colors.pink[400], Colors.pink[500], Colors.purple[500]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoContainer}
          >
            <Text style={styles.logo}>💕 SWIPE</Text>
          </LinearGradient>
          
          {/* Статистика */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{state.users.length - currentIndex}</Text>
              <Text style={styles.statLabel}>осталось</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardContainer}>
          {/* Следующая карточка (фон) с blur эффектом */}
          {state.users[currentIndex + 1] && (
            <View style={styles.backgroundCard}>
              <UserCard user={state.users[currentIndex + 1]} />
              <View style={styles.blurOverlay} />
            </View>
          )}

          {/* Текущая карточка */}
          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View
              style={[
                styles.card,
                {
                  transform: [
                    { translateX },
                    { rotate: rotateInterpolate },
                  ],
                  opacity,
                },
              ]}
            >
              <UserCard user={currentUser} />
              
              {/* Современные индикаторы лайка/дизлайка */}
              <Animated.View
                style={[
                  styles.likeIndicator,
                  {
                    opacity: translateX.interpolate({
                      inputRange: [0, SWIPE_THRESHOLD],
                      outputRange: [0, 1],
                      extrapolate: 'clamp',
                    }),
                  },
                ]}
              >
                <LinearGradient
                  colors={[Colors.dating.like, '#34D399']}
                  style={styles.indicatorGradient}
                >
                  <Ionicons name="heart" size={20} color="white" />
                  <Text style={styles.likeText}>ЛАЙК</Text>
                </LinearGradient>
              </Animated.View>
              
              <Animated.View
                style={[
                  styles.nopeIndicator,
                  {
                    opacity: translateX.interpolate({
                      inputRange: [-SWIPE_THRESHOLD, 0],
                      outputRange: [1, 0],
                      extrapolate: 'clamp',
                    }),
                  },
                ]}
              >
                <LinearGradient
                  colors={[Colors.dating.dislike, '#F87171']}
                  style={styles.indicatorGradient}
                >
                  <Ionicons name="close" size={20} color="white" />
                  <Text style={styles.nopeText}>НЕТ</Text>
                </LinearGradient>
              </Animated.View>
            </Animated.View>
          </PanGestureHandler>
        </View>

        {/* Современные кнопки действий */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSwipe('left')}
          >
            <LinearGradient
              colors={[Colors.dating.dislike, '#F87171']}
              style={styles.actionButtonGradient}
            >
              <Ionicons name="close" size={28} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Alert.alert('Суперлайк!', 'Функция суперлайка будет доступна в полной версии');
            }}
          >
            <LinearGradient
              colors={[Colors.dating.superLike, '#60A5FA']}
              style={[styles.actionButtonGradient, styles.superLikeGradient]}
            >
              <Ionicons name="star" size={22} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSwipe('right')}
          >
            <LinearGradient
              colors={[Colors.dating.like, '#34D399']}
              style={styles.actionButtonGradient}
            >
              <Ionicons name="heart" size={26} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Модальное окно для взаимного лайка */}
        {matchedUser && (
          <MatchModal
            visible={showMatchModal}
            user={matchedUser}
            onClose={handleMatchClose}
            onChat={handleMatchChat}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    height: adaptiveStyles.headerHeight,
  },
  logoContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    shadowColor: Colors.pink[500],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    fontSize: fontSize.xl,
    fontWeight: '800',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  stats: {
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    ...Glass.light,
  },
  statNumber: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: Colors.pink[600],
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: Colors.gray[600],
    fontWeight: '500',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backgroundCard: {
    position: 'absolute',
    transform: [{ scale: 0.95 }],
    opacity: 0.3,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  card: {
    position: 'absolute',
  },
  likeIndicator: {
    position: 'absolute',
    top: hp(7),
    right: spacing.lg,
    transform: [{ rotate: '15deg' }],
    shadowColor: Colors.dating.like,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  nopeIndicator: {
    position: 'absolute',
    top: hp(7),
    left: spacing.lg,
    transform: [{ rotate: '-15deg' }],
    shadowColor: Colors.dating.dislike,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  indicatorGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  likeText: {
    color: 'white',
    fontWeight: '800',
    fontSize: fontSize.md,
    marginLeft: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  nopeText: {
    color: 'white',
    fontWeight: '800',
    fontSize: fontSize.md,
    marginLeft: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: hp(3),
    paddingHorizontal: spacing.xl,
    paddingBottom: hp(4),
    minHeight: hp(12),
  },
  actionButton: {
    borderRadius: adaptiveStyles.buttonSize / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  actionButtonGradient: {
    width: adaptiveStyles.buttonSize,
    height: adaptiveStyles.buttonSize,
    borderRadius: adaptiveStyles.buttonSize / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  superLikeGradient: {
    width: adaptiveStyles.buttonSize * 0.8,
    height: adaptiveStyles.buttonSize * 0.8,
    borderRadius: (adaptiveStyles.buttonSize * 0.8) / 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    maxWidth: wp(90),
    alignSelf: 'center',
  },
  emptyTitle: {
    fontSize: fontSize.huge * 2.5,
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.gray[800],
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emptySubtext: {
    fontSize: adaptiveStyles.fontSize,
    color: Colors.gray[600],
    textAlign: 'center',
    lineHeight: adaptiveStyles.fontSize * 1.4,
  },
});
