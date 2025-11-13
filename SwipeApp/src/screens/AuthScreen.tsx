import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Button, Input } from '../components';
import { AccountSelector } from '../components/AccountSelector';
import { useApp } from '../context/AppContext';
import { AccountStorage, SavedAccount } from '../utils/storage';
import { Colors, Shadows, Glass } from '../utils/colors';
import { 
  fontSize, 
  spacing, 
  getAdaptiveStyles,
  hp 
} from '../utils/responsive';

const adaptiveStyles = getAdaptiveStyles();

export const AuthScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { login } = useApp();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showVkModal, setShowVkModal] = useState(false);
  const [showAccountSelector, setShowAccountSelector] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [googleEmail, setGoogleEmail] = useState('');
  const [googlePassword, setGooglePassword] = useState('');
  const [vkEmail, setVkEmail] = useState('');
  const [vkPassword, setVkPassword] = useState('');
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [hasAccounts, setHasAccounts] = useState(false);

  // Загрузка сохраненных аккаунтов при монтировании компонента
  useEffect(() => {
    loadSavedAccounts();
  }, []);

  /**
   * Загрузка сохраненных аккаунтов из локального хранилища
   */
  const loadSavedAccounts = async () => {
    try {
      const accounts = await AccountStorage.getSavedAccounts();
      setSavedAccounts(accounts);
      setHasAccounts(accounts.length > 0);
      
      // Автоматически заполняем поле телефона основным аккаунтом
      const defaultAccount = await AccountStorage.getDefaultAccount();
      if (defaultAccount && !phoneNumber) {
        setPhoneNumber(defaultAccount.phoneNumber);
      }
    } catch (error) {
      console.error('Ошибка при загрузке аккаунтов:', error);
    }
  };

  /**
   * Обработка входа по номеру телефона
   */
  const handlePhoneLogin = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Ошибка', 'Введите номер телефона');
      return;
    }

    if (phoneNumber.length < 10) {
      Alert.alert('Ошибка', 'Введите корректный номер телефона');
      return;
    }

    setIsLoading(true);
    
    // Симуляция отправки SMS
    setTimeout(() => {
      setIsLoading(false);
      setShowCodeModal(true);
    }, 1500);
  };

  /**
   * Обработка подтверждения кода и сохранение аккаунта
   */
  const handleCodeVerification = async () => {
    if (verificationCode === '1234') {
      setShowCodeModal(false);
      
      // Сохраняем аккаунт в локальную мини-БД
      await saveAccountToStorage(phoneNumber, 'phone');
      
      login(phoneNumber);
    } else {
      Alert.alert('Ошибка', 'Неверный код подтверждения');
    }
  };

  const handleGoogleLogin = () => {
    setShowGoogleModal(true);
  };

  /**
   * Обработка аутентификации через Google
   */
  const handleGoogleAuth = async () => {
    if (!googleEmail.trim() || !googlePassword.trim()) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }
    setShowGoogleModal(false);
    
    const accountId = `google_${googleEmail}`;
    
    // Сохраняем аккаунт в локальную мини-БД
    await saveAccountToStorage(accountId, 'google', googleEmail);
    
    login(accountId);
  };

  const handleVkLogin = () => {
    setShowVkModal(true);
  };

  /**
   * Обработка аутентификации через VK
   */
  const handleVkAuth = async () => {
    if (!vkEmail.trim() || !vkPassword.trim()) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }
    setShowVkModal(false);
    
    const accountId = `vk_${vkEmail}`;
    
    // Сохраняем аккаунт в локальную мини-БД
    await saveAccountToStorage(accountId, 'vk', vkEmail);
    
    login(accountId);
  };

  /**
   * Сохранение аккаунта в локальное хранилище
   */
  const saveAccountToStorage = async (phoneNumber: string, type: 'phone' | 'google' | 'vk', name?: string) => {
    try {
      await AccountStorage.saveAccount({
        phoneNumber,
        name: name || phoneNumber,
        avatar: undefined, // Можно добавить аватар позже
      });
      
      // Обновляем список сохраненных аккаунтов
      await loadSavedAccounts();
    } catch (error) {
      console.error('Ошибка при сохранении аккаунта:', error);
    }
  };

  /**
   * Обработка выбора сохраненного аккаунта
   */
  const handleSelectAccount = async (account: SavedAccount) => {
    try {
      // Устанавливаем выбранный аккаунт как текущий
      await AccountStorage.setCurrentAccount(account);
      
      // Входим в приложение с выбранным аккаунтом
      login(account.phoneNumber);
    } catch (error) {
      console.error('Ошибка при выборе аккаунта:', error);
      Alert.alert('Ошибка', 'Не удалось войти с выбранным аккаунтом');
    }
  };

  /**
   * Открытие селектора аккаунтов
   */
  const handleShowAccountSelector = () => {
    setShowAccountSelector(true);
  };

  /**
   * Добавление нового аккаунта (очистка формы)
   */
  const handleAddNewAccount = () => {
    setPhoneNumber('');
    setGoogleEmail('');
    setGooglePassword('');
    setVkEmail('');
    setVkPassword('');
  };


  return (
    <LinearGradient
      colors={[Colors.gray[50], Colors.pink[50], Colors.purple[50]]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            {/* Современный хедер с градиентом */}
            <View style={styles.header}>
              <LinearGradient
                colors={[Colors.pink[400], Colors.pink[500], Colors.purple[500]]}
                style={styles.logoGradient}
              >
                <Text style={styles.logoEmoji}>💕</Text>
              </LinearGradient>
              <Text style={styles.title}>Добро пожаловать в SWIPE</Text>
              <Text style={styles.subtitle}>
                Войдите в аккаунт, чтобы начать знакомиться
              </Text>
            </View>

            <View style={styles.form}>
              {/* Кнопка выбора сохраненного аккаунта с современным дизайном */}
              {hasAccounts && (
                <TouchableOpacity
                  style={styles.savedAccountsButton}
                  onPress={handleShowAccountSelector}
                >
                  <LinearGradient
                    colors={[Colors.gray[100], Colors.gray[50]]}
                    style={styles.savedAccountsGradient}
                  >
                    <Ionicons name="people-outline" size={20} color={Colors.pink[600]} />
                    <Text style={styles.savedAccountsButtonText}>
                      Выбрать аккаунт ({savedAccounts.length})
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}

              {/* Поле ввода с современным стилем */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Номер телефона</Text>
                <View style={styles.phoneInputWrapper}>
                  <Ionicons name="call-outline" size={20} color={Colors.gray[500]} />
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="+7 (999) 123-45-67"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    maxLength={18}
                    placeholderTextColor={Colors.gray[400]}
                  />
                </View>
              </View>

              {/* Современная кнопка входа */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handlePhoneLogin}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={isLoading ? [Colors.gray[300], Colors.gray[400]] : [Colors.pink[400], Colors.pink[500]]}
                  style={styles.primaryButtonGradient}
                >
                  {isLoading ? (
                    <Text style={styles.primaryButtonText}>Отправляем код...</Text>
                  ) : (
                    <>
                      <Text style={styles.primaryButtonText}>Войти по телефону</Text>
                      <Ionicons name="arrow-forward" size={20} color="white" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>или</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Современные кнопки социальных сетей */}
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleLogin}
              >
                <View style={styles.socialButtonContent}>
                  <Ionicons name="logo-google" size={20} color="#4285F4" />
                  <Text style={styles.socialButtonText}>Войти через Google</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleVkLogin}
              >
                <View style={styles.socialButtonContent}>
                  <View style={styles.vkIcon}>
                    <Text style={styles.vkIconText}>VK</Text>
                  </View>
                  <Text style={styles.socialButtonText}>Войти ВКонтакте</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Нажимая "Войти", вы соглашаетесь с{'\n'}
                <Text style={styles.footerLink}>Условиями использования</Text> и <Text style={styles.footerLink}>Политикой конфиденциальности</Text>
              </Text>
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* Модальное окно для ввода кода */}
        <Modal
          visible={showCodeModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowCodeModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Код подтверждения</Text>
              <Text style={styles.modalSubtitle}>
                На номер {phoneNumber} отправлен код подтверждения
              </Text>
              
              <TextInput
                style={styles.codeInput}
                placeholder="Введите код 1234"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="number-pad"
                maxLength={4}
                textAlign="center"
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => setShowCodeModal(false)}
                >
                  <Text style={styles.modalButtonTextSecondary}>Отмена</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handleCodeVerification}
                >
                  <Text style={styles.modalButtonTextPrimary}>Подтвердить</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Модальное окно Google */}
        <Modal
          visible={showGoogleModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowGoogleModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.googleHeader}>
                <Text style={styles.modalTitle}>Войти в Google</Text>
              </View>
              
              <TextInput
                style={styles.socialInput}
                placeholder="Email"
                value={googleEmail}
                onChangeText={setGoogleEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              <TextInput
                style={styles.socialInput}
                placeholder="Пароль"
                value={googlePassword}
                onChangeText={setGooglePassword}
                secureTextEntry={true}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => setShowGoogleModal(false)}
                >
                  <Text style={styles.modalButtonTextSecondary}>Отмена</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.googleButton]}
                  onPress={handleGoogleAuth}
                >
                  <Text style={styles.modalButtonTextPrimary}>Войти</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Модальное окно VK */}
        <Modal
          visible={showVkModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowVkModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.vkHeader}>
                <Text style={styles.modalTitle}>Войти ВКонтакте</Text>
              </View>
              
              <TextInput
                style={styles.socialInput}
                placeholder="Телефон или email"
                value={vkEmail}
                onChangeText={setVkEmail}
                autoCapitalize="none"
              />
              
              <TextInput
                style={styles.socialInput}
                placeholder="Пароль"
                value={vkPassword}
                onChangeText={setVkPassword}
                secureTextEntry={true}
              />
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => setShowVkModal(false)}
                >
                  <Text style={styles.modalButtonTextSecondary}>Отмена</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.vkButton]}
                  onPress={handleVkAuth}
                >
                  <Text style={styles.modalButtonTextPrimary}>Войти</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Модальное окно выбора аккаунта */}
        <AccountSelector
          visible={showAccountSelector}
          onClose={() => setShowAccountSelector(false)}
          onSelectAccount={handleSelectAccount}
          onAddNewAccount={handleAddNewAccount}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: hp(6),
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    shadowColor: Colors.pink[500],
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoEmoji: {
    fontSize: fontSize.huge * 1.5,
  },
  title: {
    fontSize: fontSize.huge,
    fontWeight: '800',
    color: Colors.gray[900],
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: adaptiveStyles.fontSize,
    color: Colors.gray[600],
    textAlign: 'center',
    lineHeight: adaptiveStyles.fontSize * 1.4,
    fontWeight: '500',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.huge,
  },
  savedAccountsButton: {
    marginBottom: spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.pink[300],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  savedAccountsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  savedAccountsButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: Colors.pink[700],
    marginLeft: spacing.sm,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    color: Colors.gray[700],
    marginBottom: spacing.sm,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    ...Glass.light,
  },
  phoneInput: {
    flex: 1,
    fontSize: fontSize.md,
    color: Colors.gray[800],
    marginLeft: spacing.sm,
    fontWeight: '500',
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    shadowColor: Colors.pink[500],
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  primaryButtonText: {
    fontSize: fontSize.md,
    fontWeight: '700',
    color: 'white',
    marginRight: spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray[300],
  },
  dividerText: {
    marginHorizontal: spacing.lg,
    color: Colors.gray[500],
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  socialButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    ...Glass.light,
    shadowColor: Colors.gray[300],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  socialButtonText: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: Colors.gray[700],
    marginLeft: spacing.sm,
  },
  vkIcon: {
    backgroundColor: '#0077FF',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vkIconText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: 'white',
  },
  footer: {
    paddingBottom: spacing.huge,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: Colors.gray[500],
    textAlign: 'center',
    lineHeight: fontSize.sm * 1.5,
    fontWeight: '500',
  },
  footerLink: {
    color: Colors.pink[600],
    fontWeight: '600',
  },
  // Модальные окна
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.xl,
    margin: spacing.xl,
    minWidth: 300,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  modalSubtitle: {
    fontSize: fontSize.md,
    color: '#666',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  codeInput: {
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderRadius: 12,
    padding: spacing.lg,
    fontSize: fontSize.xl,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: spacing.xl,
    letterSpacing: 8,
  },
  socialInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: spacing.lg,
    fontSize: fontSize.md,
    marginBottom: spacing.lg,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#FF6B6B',
  },
  modalButtonSecondary: {
    backgroundColor: '#F5F5F5',
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  vkButton: {
    backgroundColor: '#0077FF',
  },
  modalButtonTextPrimary: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  modalButtonTextSecondary: {
    color: '#333',
    fontSize: fontSize.md,
    fontWeight: '500',
  },
  googleHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  vkHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
});
