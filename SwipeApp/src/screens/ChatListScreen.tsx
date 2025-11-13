import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { 
  fontSize, 
  spacing, 
  getAdaptiveStyles,
  deviceSizes,
  wp,
  hp 
} from '../utils/responsive';

const adaptiveStyles = getAdaptiveStyles();

// Интерфейс для переписки
interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

// Моковые данные переписок
const mockChats: ChatItem[] = [
  {
    id: '1',
    name: 'Анна',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Привет! Как дела? 😊',
    timestamp: '14:30',
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Мария',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Спасибо за вчерашний вечер!',
    timestamp: '12:15',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '3',
    name: 'Елена',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Увидимся завтра в кафе?',
    timestamp: '10:45',
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: '4',
    name: 'Ксения',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Отлично провели время! 🎉',
    timestamp: 'Вчера',
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: '5',
    name: 'София',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
    lastMessage: 'Хочешь сходить в кино на выходных?',
    timestamp: 'Вчера',
    unreadCount: 3,
    isOnline: true,
  },
];

// Компонент элемента чата
const ChatListItem: React.FC<{ chat: ChatItem; onPress: () => void }> = ({ chat, onPress }) => {
  return (
    <TouchableOpacity style={styles.chatItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: chat.avatar }} style={styles.avatar} />
        {chat.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{chat.name}</Text>
          <Text style={styles.timestamp}>{chat.timestamp}</Text>
        </View>
        
        <View style={styles.messageRow}>
          <Text 
            style={[
              styles.lastMessage,
              chat.unreadCount > 0 && styles.unreadMessage
            ]} 
            numberOfLines={1}
          >
            {chat.lastMessage}
          </Text>
          {chat.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Основной компонент экрана списка чатов
export const ChatListScreen: React.FC = () => {
  const navigation = useNavigation();

  // Обработчик нажатия на чат
  const handleChatPress = (chat: ChatItem) => {
    // Переход к экрану конкретного чата
    (navigation as any).navigate('Chat', { 
      chatId: chat.id, 
      chatName: chat.name,
      avatar: chat.avatar 
    });
  };

  // Подсчет общего количества непрочитанных сообщений
  const totalUnreadCount = mockChats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>Сообщения</Text>
        <View style={styles.headerActions}>
          {totalUnreadCount > 0 && (
            <View style={styles.totalUnreadBadge}>
              <Text style={styles.totalUnreadText}>
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Список чатов */}
      <ScrollView style={styles.chatsList} showsVerticalScrollIndicator={false}>
        {mockChats.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color="#CCCCCC" />
            <Text style={styles.emptyText}>Пока нет сообщений</Text>
            <Text style={styles.emptySubtext}>
              Начните знакомиться, чтобы появились переписки!
            </Text>
          </View>
        ) : (
          mockChats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              onPress={() => handleChatPress(chat)}
            />
          ))
        )}
      </ScrollView>

      {/* Статистика внизу экрана */}
      <View style={styles.footer}>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{mockChats.length}</Text>
            <Text style={styles.statLabel}>Переписок</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {mockChats.filter(chat => chat.isOnline).length}
            </Text>
            <Text style={styles.statLabel}>Онлайн</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalUnreadCount}</Text>
            <Text style={styles.statLabel}>Непрочитанных</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    height: adaptiveStyles.headerHeight,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalUnreadBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    marginRight: spacing.md,
    minWidth: 24,
    alignItems: 'center',
  },
  totalUnreadText: {
    color: '#FFFFFF',
    fontSize: fontSize.xs,
    fontWeight: 'bold',
  },
  searchButton: {
    padding: spacing.sm,
  },
  chatsList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.lg,
  },
  avatar: {
    width: wp(15),
    height: wp(15),
    borderRadius: wp(7.5),
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  chatName: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: '#333',
  },
  timestamp: {
    fontSize: fontSize.sm,
    color: '#999',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: adaptiveStyles.fontSize,
    color: '#666',
    marginRight: spacing.sm,
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#333',
  },
  unreadBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    minWidth: 20,
    alignItems: 'center',
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: fontSize.xs,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp(10),
  },
  emptyText: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: '#999',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: adaptiveStyles.fontSize,
    color: '#CCCCCC',
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
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
    color: '#666',
    marginTop: spacing.xs / 2,
  },
});
