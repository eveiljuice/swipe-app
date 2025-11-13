import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Базовые размеры для дизайна (iPhone 14 Pro)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

// Определение типа устройства по размерам экрана
export const getDeviceType = () => {
  const pixelRatio = PixelRatio.get();
  const adjustedWidth = SCREEN_WIDTH * pixelRatio;
  const adjustedHeight = SCREEN_HEIGHT * pixelRatio;

  // iPhone размеры
  if (
    (adjustedWidth >= 1170 && adjustedHeight >= 2532) || // iPhone 14/15
    (adjustedWidth >= 1206 && adjustedHeight >= 2622) || // iPhone 16 Pro
    (adjustedWidth >= 1320 && adjustedHeight >= 2868)    // iPhone 16 Pro Max
  ) {
    return 'iphone-large';
  }
  
  if (adjustedWidth >= 1125 && adjustedHeight >= 2436) { // iPhone X/11/12/13 размеры
    return 'iphone-medium';
  }
  
  if (adjustedWidth >= 750 && adjustedHeight >= 1334) { // iPhone 6/7/8 размеры
    return 'iphone-small';
  }

  // Android размеры
  if (adjustedWidth >= 1440 && adjustedHeight >= 3200) { // Premium Android (Galaxy S-series)
    return 'android-premium';
  }
  
  if (adjustedWidth >= 1080 && adjustedHeight >= 2400) { // Популярные Android
    return 'android-large';
  }
  
  if (adjustedWidth >= 828 && adjustedHeight >= 1792) { // Средние Android
    return 'android-medium';
  }

  return 'android-small';
};

// Адаптивная функция для размеров
export const wp = (percentage: number): number => {
  return (percentage * SCREEN_WIDTH) / 100;
};

export const hp = (percentage: number): number => {
  return (percentage * SCREEN_HEIGHT) / 100;
};

// Масштабирование относительно базового дизайна
export const scale = (size: number): number => {
  const scaleWidth = SCREEN_WIDTH / BASE_WIDTH;
  const scaleHeight = SCREEN_HEIGHT / BASE_HEIGHT;
  const scale = Math.min(scaleWidth, scaleHeight);
  return Math.ceil(size * scale);
};

// Адаптивные размеры шрифтов
export const fontSize = {
  xs: scale(10),
  sm: scale(12),
  md: scale(14),
  lg: scale(16),
  xl: scale(18),
  xxl: scale(20),
  xxxl: scale(24),
  huge: scale(32),
};

// Адаптивные отступы
export const spacing = {
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(20),
  xxl: scale(24),
  xxxl: scale(32),
  huge: scale(40),
};

// Размеры для разных типов устройств
export const deviceSizes = {
  card: {
    width: Math.min(SCREEN_WIDTH - scale(40), 340),
    height: Math.min(SCREEN_HEIGHT * 0.75, 620),
    photoHeight: Math.min(SCREEN_HEIGHT * 0.52, 440),
  },
  button: {
    small: scale(44),
    medium: scale(56),
    large: scale(64),
  },
  borderRadius: {
    small: scale(8),
    medium: scale(12),
    large: scale(16),
    xl: scale(20),
  },
};

// Адаптивные стили для разных устройств
export const getAdaptiveStyles = () => {
  const deviceType = getDeviceType();
  
  switch (deviceType) {
    case 'iphone-large':
    case 'android-premium':
      return {
        cardPadding: spacing.xl,
        buttonSize: deviceSizes.button.large,
        fontSize: fontSize.lg,
        headerHeight: hp(8),
      };
    
    case 'iphone-medium':
    case 'android-large':
      return {
        cardPadding: spacing.lg,
        buttonSize: deviceSizes.button.medium,
        fontSize: fontSize.md,
        headerHeight: hp(7),
      };
    
    case 'android-medium':
      return {
        cardPadding: spacing.md,
        buttonSize: deviceSizes.button.medium,
        fontSize: fontSize.md,
        headerHeight: hp(6.5),
      };
    
    default: // small devices
      return {
        cardPadding: spacing.xs,
        buttonSize: deviceSizes.button.small,
        fontSize: fontSize.xs,
        headerHeight: hp(5),
      };
  }
};

export const screenDimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};
