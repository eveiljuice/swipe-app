import React, { useState, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Animated, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '../utils/colors';
import { 
  fontSize, 
  spacing, 
  getAdaptiveStyles,
  wp,
  hp 
} from '../utils/responsive';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'google' | 'vk';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
  fullWidth?: boolean;
}

const adaptiveStyles = getAdaptiveStyles();

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  fullWidth = true
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

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
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
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
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Анимация загрузки
  React.useEffect(() => {
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

  const getGradientColors = () => {
    switch (variant) {
      case 'primary':
        return [Colors.pink[400], Colors.pink[500], Colors.pink[600]];
      case 'secondary':
        return [Colors.purple[400], Colors.purple[500], Colors.purple[600]];
      case 'google':
        return ['#FFFFFF', '#FFFFFF'];
      case 'vk':
        return ['#0077FF', '#005CE6'];
      default:
        return [Colors.pink[400], Colors.pink[500]];
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.lg,
          minHeight: hp(4.5),
          borderRadius: 12,
        };
      case 'large':
        return {
          paddingVertical: spacing.xl,
          paddingHorizontal: spacing.xl * 1.5,
          minHeight: hp(7),
          borderRadius: 18,
        };
      default: // medium
        return {
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.xl,
          minHeight: hp(6),
          borderRadius: 16,
        };
    }
  };

  const getIconName = () => {
    if (icon) return icon;
    switch (variant) {
      case 'google':
        return 'logo-google';
      case 'vk':
        return 'logo-vk';
      default:
        return undefined;
    }
  };

  const renderContent = () => {
    const iconName = getIconName();
    const iconSize = size === 'small' ? 16 : size === 'large' ? 22 : 18;
    const iconColor = variant === 'google' ? '#4285F4' : 'white';

    return (
      <View style={styles.contentContainer}>
        {loading && (
          <Animated.View 
            style={[
              styles.loadingContainer,
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
            <Ionicons 
              name="refresh" 
              size={iconSize} 
              color={variant === 'google' ? Colors.gray[600] : 'white'} 
            />
          </Animated.View>
        )}
        
        {iconName && !loading && (
          <Ionicons 
            name={iconName as any} 
            size={iconSize} 
            color={iconColor} 
            style={styles.icon}
          />
        )}
        
        <Text style={[
          styles.buttonText,
          styles[`${variant}Text`],
          styles[`${size}Text`],
          disabled && styles.disabledText,
          textStyle
        ]}>
          {loading ? 'Загрузка...' : title}
        </Text>
      </View>
    );
  };

  if (variant === 'google') {
    return (
      <Animated.View style={[
        { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
        fullWidth && { width: '100%' }
      ]}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.googleButton,
            getSizeStyles(),
            disabled && styles.disabled,
            style
          ]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={disabled || loading}
          activeOpacity={1}
        >
          {renderContent()}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[
      { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
      fullWidth && { width: '100%' }
    ]}>
      <TouchableOpacity
        style={[
          styles.button,
          getSizeStyles(),
          disabled && styles.disabled,
          style
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={1}
      >
        <LinearGradient
          colors={getGradientColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.gradient, getSizeStyles()]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    overflow: 'hidden',
    shadowColor: Colors.pink[500],
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  googleButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    shadowColor: Colors.gray[400],
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    marginRight: spacing.sm,
  },
  buttonText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: 'white',
  },
  googleText: {
    color: Colors.gray[700],
  },
  vkText: {
    color: 'white',
  },
  smallText: {
    fontSize: fontSize.sm,
  },
  mediumText: {
    fontSize: fontSize.md,
  },
  largeText: {
    fontSize: fontSize.lg,
  },
  disabledText: {
    opacity: 0.7,
  },
  icon: {
    marginRight: spacing.sm,
  },
});