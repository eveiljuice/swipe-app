import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { User } from '../data/mockData';
import { spacing, fontSize } from '../utils/responsive';

// Тип параметров маршрута для чата
interface ChatRouteParams {
  user: User; // Пользователь, с которым начат чат (передаём из SwipeScreen)
}

export const ChatScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  // Достаём моковые параметры пользователя из навигации
  const { user } = (route.params || {}) as ChatRouteParams;

  return (
    <SafeAreaView style={styles.container}>
      {/* Простой кастомный заголовок, т.к. headerShown=false глобально */}
      <View style={styles.header}>
        <TouchableOpacity
          accessibilityLabel="Назад"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Чат {user ? `с ${user.name}` : ''}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Моковое содержимое чата */}
      <View style={styles.body}>
        <View style={styles.messageBubbleYou}>
          <Text style={styles.messageText}>Привет! Рад(а) знакомству 😊</Text>
        </View>
        <View style={styles.messageBubbleOther}>
          <Text style={styles.messageText}>
            {user ? `${user.name}` : 'Пользователь'} сейчас не в сети. Напишите сообщение,
            и он(а) ответит позже.
          </Text>
        </View>
      </View>

      {/* Поле ввода — мок (без логики отправки) */}
      <View style={styles.inputBar}>
        <Text style={styles.inputPlaceholder}>Напишите сообщение...</Text>
        <TouchableOpacity style={styles.sendButton}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
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
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: '#333',
  },
  body: {
    flex: 1,
    padding: spacing.lg,
  },
  messageBubbleYou: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFEEF0',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    marginBottom: spacing.sm,
    maxWidth: '80%',
  },
  messageBubbleOther: {
    alignSelf: 'flex-start',
    backgroundColor: '#F4F6F8',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    marginBottom: spacing.sm,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: fontSize.sm,
    color: '#333',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFF',
  },
  inputPlaceholder: {
    flex: 1,
    color: '#999',
    fontSize: fontSize.sm,
  },
  sendButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginLeft: spacing.md,
  },
});
