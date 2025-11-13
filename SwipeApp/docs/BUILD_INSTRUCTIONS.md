# Инструкции по сборке SWIPE

## Разработка

### Запуск в режиме разработки

```bash
npm start
# или
npx expo start
```

### Запуск на конкретной платформе

```bash
npm run android    # Android эмулятор
npm run ios        # iOS симулятор (только macOS)
npm run web        # Web версия
```

## Сборка для продакшена

### Подготовка к сборке

1. **Обновите app.json**

   - Измените `version` на актуальную версию
   - Обновите `name` и `slug` для вашего приложения
   - Добавьте собственные иконки в папку `assets/`

2. **Установите EAS CLI**

   ```bash
   npm install -g @expo/eas-cli
   ```

3. **Войдите в Expo аккаунт**
   ```bash
   eas login
   ```

### Конфигурация EAS Build

1. **Инициализация EAS**

   ```bash
   eas build:configure
   ```

2. **Создайте eas.json** (если не создался автоматически):
   ```json
   {
     "cli": {
       "version": ">= 3.0.0"
     },
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal",
         "ios": {
           "resourceClass": "m-medium"
         }
       },
       "preview": {
         "distribution": "internal",
         "ios": {
           "resourceClass": "m-medium"
         }
       },
       "production": {
         "ios": {
           "resourceClass": "m-medium"
         }
       }
     },
     "submit": {
       "production": {}
     }
   }
   ```

### Сборка APK/IPA

#### Android APK

```bash
eas build -p android --profile preview
```

#### iOS IPA (требует Apple Developer аккаунт)

```bash
eas build -p ios --profile preview
```

#### Обе платформы

```bash
eas build --profile preview
```

### Сборка для магазинов приложений

#### Google Play Store

```bash
eas build -p android --profile production
eas submit -p android
```

#### Apple App Store

```bash
eas build -p ios --profile production
eas submit -p ios
```

## Локальная сборка (альтернатива)

### Android (требует Android Studio)

```bash
npx expo run:android --variant release
```

### iOS (требует Xcode, только macOS)

```bash
npx expo run:ios --configuration Release
```

## Обновления через Expo Updates

### Публикация обновления

```bash
eas update --branch production --message "Исправление багов"
```

### Конфигурация в app.json

```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/[project-id]"
    },
    "runtimeVersion": "1.0.0"
  }
}
```

## Тестирование сборки

### Internal Distribution

1. Соберите с профилем `preview`
2. Получите ссылку для скачивания
3. Протестируйте на реальных устройствах
4. Соберите обратную связь от тестировщиков

### TestFlight (iOS) / Internal Testing (Android)

1. Соберите с профилем `production`
2. Загрузите в соответствующие сервисы
3. Пригласите тестировщиков
4. Соберите аналитику и отзывы

## Чеклист перед релизом

- [ ] Протестировано на реальных устройствах
- [ ] Все функции работают корректно
- [ ] Нет критических багов
- [ ] Производительность оптимизирована
- [ ] Иконки и splash screen настроены
- [ ] Описания в сторах подготовлены
- [ ] Скриншоты для сторов готовы
- [ ] Политика конфиденциальности создана
- [ ] Условия использования подготовлены

## Мониторинг и аналитика

### Рекомендуемые сервисы

- **Crashlytics** - отслеживание крашей
- **Analytics** - аналитика использования
- **Performance Monitoring** - мониторинг производительности

### Интеграция

```bash
npm install @react-native-firebase/app
npm install @react-native-firebase/analytics
npm install @react-native-firebase/crashlytics
```

## Полезные команды

```bash
# Очистка кэша
npx expo start --clear

# Обновление зависимостей
npx expo install --fix

# Проверка совместимости
npx expo doctor

# Просмотр логов
npx expo logs

# Просмотр состояния сборки
eas build:list
```

---

_Подробная документация доступна на [docs.expo.dev](https://docs.expo.dev)_
