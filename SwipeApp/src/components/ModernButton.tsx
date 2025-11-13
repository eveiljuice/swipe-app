import React, { useState, useRef, useEffect } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle, 
  Animated, 
  View,
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../utils/colors';
import { fontSize, spacing } from '../utils/responsive';

interface ModernButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  glowing?: boolean;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  glowing = false,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Эффект свечения
  useEffect(() => {
    if (glowing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [glowing]);

  // Анимация загрузки
  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      rotateAnim.setValue(0);
    }
  }, [loading]);

  const handlePressIn = () => {
    if (disabled || loading) return;
    setIsPressed(true);
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(rippleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(rippleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          colors: [Colors.pink[400], Colors.pink[500], Colors.pink[600]],
          textColor: 'white',
          shadowColor: Colors.pink[500],
        };
      case 'secondary':
        return {
          colors: [Colors.purple[400], Colors.purple[500], Colors.purple[600]],
          textColor: 'white',
          shadowColor: Colors.purple[500],
        };
      case 'success':
        return {
          colors: [Colors.dating.like, '#34D399', '#10B981'],
          textColor: 'white',
          shadowColor: Colors.dating.like,
        };
      case 'danger':
        return {
          colors: [Colors.dating.dislike, '#F87171', '#EF4444'],
          textColor: 'white',
          shadowColor: Colors.dating.dislike,
        };
      case 'ghost':
        return {
          colors: ['transparent', 'transparent'],
          textColor: Colors.pink[600],
          shadowColor: 'transparent',
          borderColor: Colors.pink[300],
        };
      default:
        return {
          colors: [Colors.pink[400], Colors.pink[500]],
          textColor: 'white',
          shadowColor: Colors.pink[500],
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          borderRadius: 12,
          minHeight: 36,
        };
      case 'lg':
        return {
          paddingVertical: spacing.xl,
          paddingHorizontal: spacing.xl * 1.5,
          borderRadius: 20,
          minHeight: 56,
        };
      default: // md
        return {
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.xl,
          borderRadius: 16,
          minHeight: 48,
        };
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 16;
      case 'lg': return 24;
      default: return 20;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm': return fontSize.sm;
      case 'lg': return fontSize.lg;
      default: return fontSize.md;
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const renderIcon = (position: 'left' | 'right') => {
    if (!icon || iconPosition !== position) return null;
    
    const iconColor = variant === 'ghost' ? Colors.pink[600] : variantStyles.textColor;
    
    if (loading && position === 'left') {
      return (
        <Animated.View 
          style={[
            styles.iconContainer,
            position === 'right' && styles.iconRight,
            {
              transform: [{
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                })
              }]
            }
          ]}
        >
          <Ionicons name="refresh" size={getIconSize()} color={iconColor} />
        </Animated.View>
      );
    }

    return (
      <View style={[styles.iconContainer, position === 'right' && styles.iconRight]}>
        <Ionicons name={icon as any} size={getIconSize()} color={iconColor} />
      </View>
    );
  };

  const animatedGlowStyle = glowing ? {
    shadowOpacity: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.8],
    }),
    shadowRadius: glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [8, 20],
    }),
  } : {};

  return (
    <Animated.View style={[
      { 
        transform: [{ scale: scaleAnim }],
        width: fullWidth ? '100%' : undefined,
      },
      style,
    ]}>
      <TouchableOpacity
        style={[
          styles.button,
          sizeStyles,
          {
            shadowColor: variantStyles.shadowColor,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 12,
          },
          animatedGlowStyle,
          disabled && styles.disabled,
          variant === 'ghost' && { 
            borderWidth: 2, 
            borderColor: variantStyles.borderColor,
            backgroundColor: 'transparent',
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
      >
        {variant !== 'ghost' ? (
          <LinearGradient
            colors={variantStyles.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.gradient, sizeStyles]}
          >
            {/* Эффект ripple */}
            <Animated.View
              style={[
                styles.ripple,
                {
                  opacity: rippleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.3],
                  }),
                  transform: [{
                    scale: rippleAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 2],
                    })
                  }],
                },
              ]}
            />
            
            <View style={styles.contentContainer}>
              {renderIcon('left')}
              <Text style={[
                styles.text,
                { 
                  color: variantStyles.textColor,
                  fontSize: getFontSize(),
                },
                textStyle,
              ]}>
                {loading ? 'Загрузка...' : title}
              </Text>
              {renderIcon('right')}
            </View>
          </LinearGradient>
        ) : (
          <View style={[styles.contentContainer, sizeStyles]}>
            {renderIcon('left')}
            <Text style={[
              styles.text,
              { 
                color: variantStyles.textColor,
                fontSize: getFontSize(),
              },
              textStyle,
            ]}>
              {loading ? 'Загрузка...' : title}
            </Text>
            {renderIcon('right')}
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    overflow: 'hidden',
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
  iconContainer: {
    marginRight: spacing.xs,
  },
  iconRight: {
    marginRight: 0,
    marginLeft: spacing.xs,
  },
  disabled: {
    opacity: 0.5,
  },
  ripple: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});
