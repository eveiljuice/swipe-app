import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  fontSize, 
  spacing, 
  getAdaptiveStyles,
  deviceSizes,
  wp,
  hp 
} from '../utils/responsive';

const adaptiveStyles = getAdaptiveStyles();

// Интерфейс для события
export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'date' | 'meeting' | 'reminder';
  description?: string;
}

interface CalendarProps {
  events: CalendarEvent[];
  onEventPress?: (event: CalendarEvent) => void;
  onAddEvent?: () => void;
  isEditable?: boolean;
}

// Компонент календаря для профиля
export const Calendar: React.FC<CalendarProps> = ({
  events = [],
  onEventPress,
  onAddEvent,
  isEditable = false,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Получаем события для текущего месяца
  const getCurrentMonthEvents = () => {
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getMonth() === currentMonth && 
             eventDate.getFullYear() === currentYear;
    });
  };

  // Получаем ближайшие события (следующие 7 дней)
  const getUpcomingEvents = () => {
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return events
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Форматирование даты
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      weekday: 'short',
    };
    return date.toLocaleDateString('ru-RU', options);
  };

  // Получение иконки для типа события
  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'date':
        return 'heart';
      case 'meeting':
        return 'people';
      case 'reminder':
        return 'notifications';
      default:
        return 'calendar';
    }
  };

  // Получение цвета для типа события
  const getEventColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'date':
        return '#FF6B6B';
      case 'meeting':
        return '#4ECDC4';
      case 'reminder':
        return '#45B7D1';
      default:
        return '#95A5A6';
    }
  };

  const upcomingEvents = getUpcomingEvents();

  if (events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="calendar-outline" size={48} color="#CCCCCC" />
        <Text style={styles.emptyText}>Нет запланированных событий</Text>
        {isEditable && onAddEvent && (
          <TouchableOpacity style={styles.addButton} onPress={onAddEvent}>
            <Text style={styles.addButtonText}>Добавить событие</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Заголовок с кнопкой добавления */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Ближайшие события</Text>
        {isEditable && onAddEvent && (
          <TouchableOpacity style={styles.addIconButton} onPress={onAddEvent}>
            <Ionicons name="add-circle" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        )}
      </View>

      {/* Список ближайших событий */}
      <ScrollView style={styles.eventsContainer} showsVerticalScrollIndicator={false}>
        {upcomingEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventItem}
            onPress={() => onEventPress?.(event)}
            activeOpacity={0.7}
          >
            <View style={[styles.eventIcon, { backgroundColor: getEventColor(event.type) }]}>
              <Ionicons 
                name={getEventIcon(event.type)} 
                size={16} 
                color="#FFFFFF" 
              />
            </View>
            
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDate}>
                {formatDate(new Date(event.date))} в {event.time}
              </Text>
              {event.description && (
                <Text style={styles.eventDescription} numberOfLines={2}>
                  {event.description}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Статистика событий */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{events.length}</Text>
          <Text style={styles.statLabel}>Всего событий</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{upcomingEvents.length}</Text>
          <Text style={styles.statLabel}>Ближайшие</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {events.filter(e => e.type === 'date').length}
          </Text>
          <Text style={styles.statLabel}>Свидания</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    backgroundColor: '#F8F8F8',
    borderRadius: deviceSizes.borderRadius.medium,
  },
  emptyText: {
    fontSize: adaptiveStyles.fontSize,
    color: '#999999',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  addButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: deviceSizes.borderRadius.medium,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: '#333333',
  },
  addIconButton: {
    padding: spacing.xs,
  },
  eventsContainer: {
    maxHeight: hp(25),
    marginBottom: spacing.lg,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: '#F8F8F8',
    borderRadius: deviceSizes.borderRadius.medium,
    marginBottom: spacing.sm,
  },
  eventIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#333333',
    marginBottom: spacing.xs / 2,
  },
  eventDate: {
    fontSize: fontSize.sm,
    color: '#666666',
    marginBottom: spacing.xs / 2,
  },
  eventDescription: {
    fontSize: fontSize.sm,
    color: '#999999',
    lineHeight: fontSize.sm * 1.3,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.md,
    backgroundColor: '#F8F8F8',
    borderRadius: deviceSizes.borderRadius.medium,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: '#666666',
    marginTop: spacing.xs / 2,
  },
});
