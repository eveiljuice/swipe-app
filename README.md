# 💕 SWIPE - Modern Dating App

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Expo](https://img.shields.io/badge/Expo-~53.0.20-black.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.79.5-61DAFB.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-~5.8.3-3178C6.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

A beautiful, modern dating app built with React Native and Expo. Swipe through profiles, match with people, and start meaningful conversations.

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Project Structure](#-project-structure) • [Troubleshooting](#-troubleshooting)

</div>

---

## ✨ Features

- 🎯 **Swipe Interface** - Intuitive card-based swiping with smooth animations
- 💬 **Real-time Chat** - Chat with your matches instantly
- 👤 **User Profiles** - Beautiful profile cards with photos and information
- 🎨 **Modern UI/UX** - Glassmorphism design with gradient backgrounds
- 📱 **Cross-platform** - Works on iOS, Android, and Web
- 🔔 **Match Notifications** - Get notified when you have a mutual match
- 📍 **Location-based** - Discover people nearby
- 🎭 **Onboarding Flow** - Smooth user onboarding experience

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Expo CLI** - Will be installed globally
- **Expo Go** app on your mobile device (for testing on physical devices)
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/swipe-app.git
cd swipe-app/SwipeApp
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- React Native and Expo SDK
- Navigation libraries
- Gesture handlers
- Image picker and location services
- And more...

### Step 3: Install Expo CLI Globally (if not already installed)

```bash
npm install -g @expo/cli
```

## 🎮 Usage

### Development Mode

Start the Expo development server:

```bash
npm start
```

This will:
- Start the Metro bundler
- Display a QR code in your terminal
- Open Expo DevTools in your browser

### Running on Different Platforms

#### 🌐 Web Browser

```bash
npm run web
```

The app will automatically open in your default browser at `http://localhost:19006`

#### 📱 iOS Simulator (macOS only)

```bash
npm run ios
```

**Note:** Requires Xcode and iOS Simulator to be installed.

#### 🤖 Android Emulator

```bash
npm run android
```

**Note:** Requires Android Studio and an Android emulator to be set up.

#### 📲 Physical Device

1. Start the development server: `npm start`
2. Install **Expo Go** on your device:
   - [iOS](https://apps.apple.com/app/expo-go/id982107779)
   - [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)
3. Scan the QR code:
   - **iOS**: Use the Camera app
   - **Android**: Use the Expo Go app to scan
4. Make sure your device and computer are on the same Wi-Fi network

### Using Tunnel Mode (if QR code doesn't work)

If you're having trouble connecting, try tunnel mode:

```bash
npx expo start --tunnel
```

## 📁 Project Structure

```
SwipeApp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── UserCard.tsx     # Profile card component
│   │   ├── MatchModal.tsx   # Match notification modal
│   │   ├── Button.tsx       # Custom button component
│   │   └── ...
│   ├── screens/             # App screens
│   │   ├── AuthScreen.tsx   # Login/Registration
│   │   ├── SwipeScreen.tsx  # Main swiping interface
│   │   ├── ChatScreen.tsx   # Chat interface
│   │   ├── ProfileScreen.tsx # User profile
│   │   └── ...
│   ├── navigation/          # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── context/             # React Context for state management
│   │   └── AppContext.tsx
│   ├── utils/               # Utility functions
│   │   ├── colors.ts        # Color scheme
│   │   ├── responsive.ts    # Responsive design helpers
│   │   └── storage.ts       # AsyncStorage helpers
│   └── data/                # Mock data
│       └── mockData.ts
├── assets/                  # Images, icons, fonts
├── App.tsx                  # Root component
├── app.json                 # Expo configuration
├── package.json             # Dependencies
└── tsconfig.json           # TypeScript configuration
```

## 🎨 Key Features Explained

### Swipe Functionality

- **Swipe Right** (Like): Tap the heart icon or swipe right on a card
- **Swipe Left** (Pass): Tap the X icon or swipe left on a card
- **View Profile**: Tap on the card to see more details
- **Smooth Animations**: Cards animate smoothly with rotation and opacity effects

### Matching System

- When you swipe right on someone who also swiped right on you, you get a match!
- Match notifications appear as a beautiful modal with celebration effects
- Matched users appear in your chat list

### Chat Features

- Real-time messaging interface
- Chat list shows all your matches
- Clean, modern chat UI

## 🔧 Configuration

### App Configuration (`app.json`)

The app is configured with:
- **App Name**: SWIPE
- **Slug**: swipe-app
- **Orientation**: Portrait only
- **Permissions**: Camera, Photo Library, Location

### Environment Variables

Currently, the app uses mock data. To connect to a backend:

1. Create a `.env` file in the `SwipeApp` directory
2. Add your API endpoints:
```env
API_URL=your_api_url_here
```

## 🐛 Troubleshooting

### Common Issues

#### ❌ "npm: command not found"

**Solution:**
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal/command prompt
- Verify installation: `node --version` and `npm --version`

#### ❌ "expo: command not found"

**Solution:**
```bash
npm install -g @expo/cli
```

#### ❌ QR Code won't scan

**Solutions:**
1. Ensure your phone and computer are on the same Wi-Fi network
2. Try tunnel mode: `npx expo start --tunnel`
3. Manually enter the connection URL in Expo Go app

#### ❌ App won't load on device

**Solutions:**
1. Close and reopen Expo Go app
2. Restart the development server: `npm start`
3. Clear Expo cache: `npx expo start -c`
4. Check your internet connection

#### ❌ Metro bundler errors

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npx expo start -c
```

#### ❌ TypeScript errors

**Solution:**
```bash
# Reinstall TypeScript dependencies
npm install --save-dev typescript @types/react @types/react-native
```

### Platform-Specific Issues

#### iOS

- Ensure Xcode Command Line Tools are installed: `xcode-select --install`
- For physical devices, ensure your Apple Developer account is configured

#### Android

- Ensure Android SDK is properly installed
- Set up Android emulator in Android Studio
- Check that `ANDROID_HOME` environment variable is set

## 📱 Building for Production

### iOS Build

```bash
npx expo build:ios
```

### Android Build

```bash
npx expo build:android
```

For more details, see [Expo's build documentation](https://docs.expo.dev/build/introduction/).

## 🛠 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run web` | Run app in web browser |
| `npm run ios` | Run app in iOS simulator |
| `npm run android` | Run app in Android emulator |

## 📚 Technologies Used

- **React Native** - Mobile framework
- **Expo** - Development platform and toolchain
- **TypeScript** - Type-safe JavaScript
- **React Navigation** - Navigation library
- **React Native Gesture Handler** - Gesture recognition
- **React Native Reanimated** - Smooth animations
- **Expo Image Picker** - Image selection
- **Expo Location** - Location services
- **AsyncStorage** - Local data persistence

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Your Name**
- GitHub: [@eveiljuice](https://github.com/eveiljuice)

## 🙏 Acknowledgments

- Expo team for the amazing development platform
- React Native community
- All contributors and users

---

<div align="center">

**Made with ❤️ using React Native and Expo**

⭐ Star this repo if you find it helpful!

</div>
