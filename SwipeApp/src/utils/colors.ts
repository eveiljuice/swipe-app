// Современная цветовая схема для зумеров
export const Colors = {
  // Основные светло-серые тона
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5', 
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // Светло-розовые акценты
  pink: {
    50: '#FDF2F8',
    100: '#FCE7F3',
    200: '#FBCFE8',
    300: '#F9A8D4',
    400: '#F472B6',
    500: '#EC4899',
    600: '#DB2777',
    700: '#BE185D',
    800: '#9D174D',
    900: '#831843',
  },

  // Дополнительные акценты
  purple: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    200: '#E9D5FF',
    300: '#D8B4FE',
    400: '#C084FC',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7C2D12',
    800: '#6B21A8',
    900: '#581C87',
  },

  // Градиенты для современного вида
  gradients: {
    primary: 'linear-gradient(135deg, #EC4899 0%, #F472B6 50%, #FBCFE8 100%)',
    secondary: 'linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 50%, #E0E0E0 100%)',
    accent: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
    soft: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)',
    glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  },

  // Семантические цвета
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Специальные цвета для дейтинг-приложения
  dating: {
    like: '#10B981',
    dislike: '#EF4444',
    superLike: '#3B82F6',
    match: '#EC4899',
    online: '#10B981',
    away: '#F59E0B',
    offline: '#9E9E9E',
  }
};

// Стили теней для современного вида
export const Shadows = {
  soft: '0 2px 8px rgba(0, 0, 0, 0.04)',
  medium: '0 4px 12px rgba(0, 0, 0, 0.08)',
  large: '0 8px 24px rgba(0, 0, 0, 0.12)',
  xl: '0 12px 32px rgba(0, 0, 0, 0.16)',
  glass: '0 8px 32px rgba(236, 72, 153, 0.15)',
  pink: '0 8px 24px rgba(236, 72, 153, 0.25)',
};

// Стили для glassmorphism эффекта
export const Glass = {
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  },
  dark: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    backdropFilter: 'blur(10px)', 
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  pink: {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(236, 72, 153, 0.2)',
  }
};
