import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import { AccountStorage, SavedAccount } from '../utils/storage';
import { 
  fontSize, 
  spacing, 
  getAdaptiveStyles,
  hp 
} from '../utils/responsive';

const adaptiveStyles = getAdaptiveStyles();

interface AccountSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectAccount: (account: SavedAccount) => void;
  onAddNewAccount: () => void;
}

/**
 * Компонент для выбора сохраненного аккаунта
 */
export const AccountSelector: React.FC<AccountSelectorProps> = ({
  visible,
  onClose,
  onSelectAccount,
  onAddNewAccount,
}) => {
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [loading, setLoading] = useState(false);

  // Загружаем сохраненные аккаунты при открытии модального окна
  useEffect(() => {
    if (visible) {
      loadSavedAccounts();
    }
  }, [visible]);

  /**
   * Загрузка сохраненных аккаунтов из локального хранилища
   */
  const loadSavedAccounts = async () => {
    setLoading(true);
    try {
      const accounts = await AccountStorage.getSavedAccounts();
      setSavedAccounts(accounts);
    } catch (error) {
      console.error('Ошибка при загрузке аккаунтов:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить сохраненные аккаунты');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Выбор аккаунта
   */
  const handleSelectAccount = async (account: SavedAccount) => {
    try {
      // Обновляем дату последнего входа
      await AccountStorage.saveAccount({
        phoneNumber: account.phoneNumber,
        name: account.name,
        avatar: account.avatar,
        isDefault: account.isDefault,
      });
      
      // Устанавливаем как текущий аккаунт
      await AccountStorage.setCurrentAccount(account);
      
      onSelectAccount(account);
      onClose();
    } catch (error) {
      console.error('Ошибка при выборе аккаунта:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать аккаунт');
    }
  };

  /**
   * Удаление аккаунта
   */
  const handleDeleteAccount = (account: SavedAccount) => {
    Alert.alert(
      'Удалить аккаунт',
      `Вы уверены, что хотите удалить аккаунт ${account.phoneNumber}?`,
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await AccountStorage.removeAccount(account.id);
              await loadSavedAccounts(); // Перезагружаем список
            } catch (error) {
              console.error('Ошибка при удалении аккаунта:', error);
              Alert.alert('Ошибка', 'Не удалось удалить аккаунт');
            }
          },
        },
      ]
    );
  };

  /**
   * Установка аккаунта как основного
   */
  const handleSetAsDefault = async (account: SavedAccount) => {
    try {
      await AccountStorage.setDefaultAccount(account.id);
      await loadSavedAccounts(); // Перезагружаем список
    } catch (error) {
      console.error('Ошибка при установке основного аккаунта:', error);
      Alert.alert('Ошибка', 'Не удалось установить основной аккаунт');
    }
  };

  /**
   * Форматирование даты последнего входа
   */
  const formatLastLoginDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Только что';
    } else if (diffInHours < 24) {
      return `${diffInHours} ч. назад`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} дн. назад`;
    }
  };

  /**
   * Рендер элемента аккаунта
   */
  const renderAccountItem = ({ item }: { item: SavedAccount }) => (
    <View style={styles.accountItem}>
      <TouchableOpacity
        style={styles.accountInfo}
        onPress={() => handleSelectAccount(item)}
      >
        <View style={styles.accountAvatar}>
          <Text style={styles.accountAvatarText}>
            {item.name ? item.name.charAt(0).toUpperCase() : item.phoneNumber.charAt(-1)}
          </Text>
        </View>
        
        <View style={styles.accountDetails}>
          <View style={styles.accountHeader}>
            <Text style={styles.accountPhone}>{item.phoneNumber}</Text>
            {item.isDefault && (
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>Основной</Text>
              </View>
            )}
          </View>
          
          {item.name && (
            <Text style={styles.accountName}>{item.name}</Text>
          )}
          
          <Text style={styles.lastLogin}>
            Последний вход: {formatLastLoginDate(item.lastLoginDate)}
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.accountActions}>
        {!item.isDefault && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetAsDefault(item)}
          >
            <Text style={styles.actionButtonText}>★</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteAccount(item)}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Выберите аккаунт</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Загрузка аккаунтов...</Text>
          </View>
        ) : (
          <>
            {savedAccounts.length > 0 ? (
              <FlatList
                data={savedAccounts}
                keyExtractor={(item) => item.id}
                renderItem={renderAccountItem}
                style={styles.accountsList}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Нет сохраненных аккаунтов</Text>
                <Text style={styles.emptySubtext}>
                  Войдите в аккаунт, чтобы он был сохранен
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.addAccountButton}
              onPress={() => {
                onAddNewAccount();
                onClose();
              }}
            >
              <Text style={styles.addAccountButtonText}>+ Добавить новый аккаунт</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: fontSize.lg,
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSize.md,
    color: '#666',
  },
  accountsList: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  accountInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  accountAvatarText: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: '#fff',
  },
  accountDetails: {
    flex: 1,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  accountPhone: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#333',
    marginRight: spacing.sm,
  },
  defaultBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
  },
  defaultBadgeText: {
    fontSize: fontSize.xs,
    color: '#fff',
    fontWeight: '500',
  },
  accountName: {
    fontSize: fontSize.sm,
    color: '#666',
    marginBottom: spacing.xs,
  },
  lastLogin: {
    fontSize: fontSize.xs,
    color: '#999',
  },
  accountActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  actionButtonText: {
    fontSize: fontSize.md,
    color: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  deleteButtonText: {
    fontSize: fontSize.md,
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: '#333',
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: fontSize.md,
    color: '#666',
    textAlign: 'center',
  },
  addAccountButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  addAccountButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: '#fff',
  },
});
