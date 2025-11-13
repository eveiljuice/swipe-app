import AsyncStorage from '@react-native-async-storage/async-storage';

// Интерфейс для сохраненного аккаунта пользователя
export interface SavedAccount {
  id: string;
  phoneNumber: string;
  name?: string;
  avatar?: string;
  lastLoginDate: string;
  isDefault?: boolean; // флаг для основного аккаунта
}

// Ключи для AsyncStorage
const STORAGE_KEYS = {
  SAVED_ACCOUNTS: '@swipe_app_saved_accounts',
  CURRENT_ACCOUNT: '@swipe_app_current_account',
  USER_PREFERENCES: '@swipe_app_user_preferences',
} as const;

/**
 * Класс для работы с локальным хранилищем аккаунтов
 */
export class AccountStorage {
  
  /**
   * Получить все сохраненные аккаунты
   */
  static async getSavedAccounts(): Promise<SavedAccount[]> {
    try {
      const accountsJson = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_ACCOUNTS);
      if (!accountsJson) {
        return [];
      }
      return JSON.parse(accountsJson);
    } catch (error) {
      console.error('Ошибка при получении сохраненных аккаунтов:', error);
      return [];
    }
  }

  /**
   * Сохранить новый аккаунт или обновить существующий
   */
  static async saveAccount(account: Omit<SavedAccount, 'id' | 'lastLoginDate'>): Promise<boolean> {
    try {
      const existingAccounts = await this.getSavedAccounts();
      
      // Проверяем, существует ли уже аккаунт с таким номером телефона
      const existingAccountIndex = existingAccounts.findIndex(
        acc => acc.phoneNumber === account.phoneNumber
      );

      const newAccount: SavedAccount = {
        ...account,
        id: existingAccountIndex >= 0 
          ? existingAccounts[existingAccountIndex].id 
          : this.generateAccountId(),
        lastLoginDate: new Date().toISOString(),
      };

      let updatedAccounts: SavedAccount[];
      
      if (existingAccountIndex >= 0) {
        // Обновляем существующий аккаунт
        updatedAccounts = [...existingAccounts];
        updatedAccounts[existingAccountIndex] = newAccount;
      } else {
        // Добавляем новый аккаунт
        updatedAccounts = [...existingAccounts, newAccount];
      }

      // Если это первый аккаунт, делаем его основным
      if (updatedAccounts.length === 1) {
        updatedAccounts[0].isDefault = true;
      }

      await AsyncStorage.setItem(
        STORAGE_KEYS.SAVED_ACCOUNTS, 
        JSON.stringify(updatedAccounts)
      );
      
      return true;
    } catch (error) {
      console.error('Ошибка при сохранении аккаунта:', error);
      return false;
    }
  }

  /**
   * Удалить аккаунт по ID
   */
  static async removeAccount(accountId: string): Promise<boolean> {
    try {
      const existingAccounts = await this.getSavedAccounts();
      const filteredAccounts = existingAccounts.filter(acc => acc.id !== accountId);
      
      // Если удаляем основной аккаунт и есть другие, делаем первый основным
      const removedAccount = existingAccounts.find(acc => acc.id === accountId);
      if (removedAccount?.isDefault && filteredAccounts.length > 0) {
        filteredAccounts[0].isDefault = true;
      }

      await AsyncStorage.setItem(
        STORAGE_KEYS.SAVED_ACCOUNTS, 
        JSON.stringify(filteredAccounts)
      );
      
      return true;
    } catch (error) {
      console.error('Ошибка при удалении аккаунта:', error);
      return false;
    }
  }

  /**
   * Установить аккаунт как основной
   */
  static async setDefaultAccount(accountId: string): Promise<boolean> {
    try {
      const existingAccounts = await this.getSavedAccounts();
      const updatedAccounts = existingAccounts.map(acc => ({
        ...acc,
        isDefault: acc.id === accountId,
      }));

      await AsyncStorage.setItem(
        STORAGE_KEYS.SAVED_ACCOUNTS, 
        JSON.stringify(updatedAccounts)
      );
      
      return true;
    } catch (error) {
      console.error('Ошибка при установке основного аккаунта:', error);
      return false;
    }
  }

  /**
   * Получить основной аккаунт
   */
  static async getDefaultAccount(): Promise<SavedAccount | null> {
    try {
      const accounts = await this.getSavedAccounts();
      return accounts.find(acc => acc.isDefault) || accounts[0] || null;
    } catch (error) {
      console.error('Ошибка при получении основного аккаунта:', error);
      return null;
    }
  }

  /**
   * Сохранить текущий активный аккаунт
   */
  static async setCurrentAccount(account: SavedAccount): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.CURRENT_ACCOUNT, 
        JSON.stringify(account)
      );
      return true;
    } catch (error) {
      console.error('Ошибка при сохранении текущего аккаунта:', error);
      return false;
    }
  }

  /**
   * Получить текущий активный аккаунт
   */
  static async getCurrentAccount(): Promise<SavedAccount | null> {
    try {
      const accountJson = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_ACCOUNT);
      return accountJson ? JSON.parse(accountJson) : null;
    } catch (error) {
      console.error('Ошибка при получении текущего аккаунта:', error);
      return null;
    }
  }

  /**
   * Очистить все данные аккаунтов (для выхода из всех аккаунтов)
   */
  static async clearAllAccounts(): Promise<boolean> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.SAVED_ACCOUNTS,
        STORAGE_KEYS.CURRENT_ACCOUNT,
      ]);
      return true;
    } catch (error) {
      console.error('Ошибка при очистке всех аккаунтов:', error);
      return false;
    }
  }

  /**
   * Поиск аккаунта по номеру телефона
   */
  static async findAccountByPhone(phoneNumber: string): Promise<SavedAccount | null> {
    try {
      const accounts = await this.getSavedAccounts();
      return accounts.find(acc => acc.phoneNumber === phoneNumber) || null;
    } catch (error) {
      console.error('Ошибка при поиске аккаунта по телефону:', error);
      return null;
    }
  }

  /**
   * Генерация уникального ID для аккаунта
   */
  private static generateAccountId(): string {
    return `account_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Получить статистику использования аккаунтов
   */
  static async getAccountsStats(): Promise<{
    totalAccounts: number;
    lastUsedAccount: SavedAccount | null;
    oldestAccount: SavedAccount | null;
  }> {
    try {
      const accounts = await this.getSavedAccounts();
      
      if (accounts.length === 0) {
        return {
          totalAccounts: 0,
          lastUsedAccount: null,
          oldestAccount: null,
        };
      }

      // Сортируем по дате последнего входа
      const sortedByLastLogin = [...accounts].sort(
        (a, b) => new Date(b.lastLoginDate).getTime() - new Date(a.lastLoginDate).getTime()
      );

      return {
        totalAccounts: accounts.length,
        lastUsedAccount: sortedByLastLogin[0],
        oldestAccount: sortedByLastLogin[sortedByLastLogin.length - 1],
      };
    } catch (error) {
      console.error('Ошибка при получении статистики аккаунтов:', error);
      return {
        totalAccounts: 0,
        lastUsedAccount: null,
        oldestAccount: null,
      };
    }
  }
}

/**
 * Утилиты для работы с пользовательскими настройками
 */
export class UserPreferences {
  
  /**
   * Сохранить настройки пользователя
   */
  static async savePreferences(preferences: Record<string, any>): Promise<boolean> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_PREFERENCES, 
        JSON.stringify(preferences)
      );
      return true;
    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error);
      return false;
    }
  }

  /**
   * Получить настройки пользователя
   */
  static async getPreferences(): Promise<Record<string, any>> {
    try {
      const preferencesJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return preferencesJson ? JSON.parse(preferencesJson) : {};
    } catch (error) {
      console.error('Ошибка при получении настроек:', error);
      return {};
    }
  }
}
