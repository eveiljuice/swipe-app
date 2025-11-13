import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { User } from '../data/mockData';
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

interface UserCardProps {
  user: User;
}

const adaptiveStyles = getAdaptiveStyles();

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  return (
    <View style={styles.card}>
      {/* Основное фото с современными эффектами */}
      <View style={styles.photoContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / deviceSizes.card.width);
            setCurrentPhotoIndex(index);
          }}
        >
          {user.photos.map((photo, index) => (
            <View key={index} style={styles.photoWrapper}>
              <Image 
                source={typeof photo === 'string' ? { uri: photo } : photo} 
                style={styles.photo} 
              />
              {/* Градиентный оверлей снизу */}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                style={styles.photoGradient}
              />
            </View>
          ))}
        </ScrollView>
        
        {/* Современные индикаторы фото */}
        {user.photos.length > 1 && (
          <View style={styles.photoIndicators}>
            {user.photos.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentPhotoIndex && styles.activeIndicator
                ]}
              />
            ))}
          </View>
        )}

        {/* Статус онлайн */}
        <View style={styles.onlineStatus}>
          <View style={[styles.statusDot, { backgroundColor: Colors.dating.online }]} />
          <Text style={styles.statusText}>Онлайн</Text>
        </View>
      </View>
      
      {/* Информация с glassmorphism эффектом */}
      <View style={styles.infoContainer}>
        {/* Основная информация */}
        <View style={styles.topInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
              {user.name}, {user.age}
            </Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.pink[500]} />
            </View>
          </View>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={Colors.gray[500]} />
            <Text style={styles.city} numberOfLines={1} ellipsizeMode="tail">
              {user.city}
            </Text>
          </View>
        </View>
        
        {/* Био */}
        {user.bio && (
          <View style={styles.middleInfo}>
            <Text style={styles.bio} numberOfLines={3} ellipsizeMode="tail">
              {user.bio}
            </Text>
          </View>
        )}
        
        {/* Интересы с современным дизайном */}
        <View style={styles.bottomInfo}>
          <View style={styles.interestsContainer}>
            {user.interests.slice(0, 3).map((interest, index) => (
              <LinearGradient
                key={index}
                colors={[Colors.pink[100], Colors.pink[50]]}
                style={styles.interestTag}
              >
                <Text style={styles.interestText} numberOfLines={1} ellipsizeMode="tail">
                  {interest}
                </Text>
              </LinearGradient>
            ))}
            {user.interests.length > 3 && (
              <View style={[styles.interestTag, styles.moreInterestsTag]}>
                <Text style={styles.moreInterestsText}>
                  +{user.interests.length - 3}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Быстрые действия */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={[Colors.pink[400], Colors.pink[500]]}
              style={styles.actionButtonGradient}
            >
              <Ionicons name="chatbubble-outline" size={18} color="white" />
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <LinearGradient
              colors={[Colors.purple[400], Colors.purple[500]]}
              style={styles.actionButtonGradient}
            >
              <Ionicons name="gift-outline" size={18} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: deviceSizes.card.width,
    height: deviceSizes.card.height,
    maxWidth: 340,
    backgroundColor: Colors.gray[50],
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: Colors.pink[500],
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  photoContainer: {
    height: deviceSizes.card.photoHeight,
    position: 'relative',
  },
  photoWrapper: {
    width: deviceSizes.card.width,
    height: deviceSizes.card.photoHeight,
    position: 'relative',
  },
  photo: {
    width: deviceSizes.card.width,
    height: deviceSizes.card.photoHeight,
    resizeMode: 'cover',
  },
  photoGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  photoIndicators: {
    position: 'absolute',
    top: spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 3,
  },
  activeIndicator: {
    backgroundColor: Colors.pink[400],
    width: 20,
    borderRadius: 10,
  },
  onlineStatus: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: 12,
    ...Glass.light,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statusText: {
    fontSize: fontSize.xs,
    color: Colors.gray[700],
    fontWeight: '600',
  },
  infoContainer: {
    height: deviceSizes.card.height - deviceSizes.card.photoHeight,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  topInfo: {
    marginBottom: spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: Colors.gray[900],
    flex: 1,
  },
  verifiedBadge: {
    marginLeft: spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  city: {
    fontSize: fontSize.md,
    color: Colors.gray[600],
    marginLeft: 4,
    fontWeight: '500',
  },
  middleInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    marginBottom: spacing.sm,
  },
  bio: {
    fontSize: fontSize.sm,
    color: Colors.gray[700],
    lineHeight: fontSize.sm * 1.4,
    textAlign: 'left',
  },
  bottomInfo: {
    marginBottom: spacing.sm,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  interestTag: {
    borderRadius: 16,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    maxWidth: wp(28),
  },
  interestText: {
    fontSize: fontSize.xs,
    color: Colors.pink[700],
    fontWeight: '600',
    textAlign: 'center',
  },
  moreInterestsTag: {
    backgroundColor: Colors.gray[200],
  },
  moreInterestsText: {
    fontSize: fontSize.xs,
    color: Colors.gray[600],
    fontWeight: '600',
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: spacing.sm,
  },
  actionButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  actionButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
