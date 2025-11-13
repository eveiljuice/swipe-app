import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Button, Input } from '../components';
import { useApp } from '../context/AppContext';
import { interestsList, cities } from '../data/mockData';
import { 
  fontSize, 
  spacing, 
  getAdaptiveStyles,
  deviceSizes,
  wp,
  hp 
} from '../utils/responsive';

const adaptiveStyles = getAdaptiveStyles();

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { updateProfile, dispatch } = useApp();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    city: '',
    photos: [] as string[],
    interests: [] as string[],
    bio: '',
  });

  const steps = [
    { title: 'Фотографии', subtitle: 'Добавьте ваши лучшие фото' },
    { title: 'Основная информация', subtitle: 'Расскажите о себе' },
    { title: 'Интересы', subtitle: 'Выберите ваши увлечения' },
    { title: 'О себе', subtitle: 'Напишите немного о себе' },
  ];

  const handleNext = () => {
    if (currentStep === 0 && formData.photos.length === 0) {
      Alert.alert('Ошибка', 'Добавьте хотя бы одну фотографию');
      return;
    }
    
    if (currentStep === 1) {
      if (!formData.name.trim() || !formData.age.trim() || !formData.city.trim()) {
        Alert.alert('Ошибка', 'Заполните все обязательные поля');
        return;
      }
      if (parseInt(formData.age) < 18 || parseInt(formData.age) > 100) {
        Alert.alert('Ошибка', 'Введите корректный возраст (18-100 лет)');
        return;
      }
    }

    if (currentStep === 2 && formData.interests.length === 0) {
      Alert.alert('Ошибка', 'Выберите хотя бы один интерес');
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = () => {
    updateProfile({
      name: formData.name,
      age: parseInt(formData.age),
      city: formData.city,
      photos: formData.photos,
      interests: formData.interests,
      bio: formData.bio,
    });
    dispatch({ type: 'COMPLETE_ONBOARDING' });
    // Навигация произойдет автоматически через AppNavigator
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ошибка', 'Необходимо разрешение для доступа к фотографиям');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, result.assets[0].uri],
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ошибка', 'Необходимо разрешение для доступа к геолокации');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (geocode.length > 0) {
        const city = geocode[0].city || geocode[0].district || 'Неизвестный город';
        setFormData(prev => ({ ...prev, city }));
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось определить местоположение');
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const renderPhotoStep = () => (
    <View style={styles.stepContent}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {formData.photos.map((photo, index) => (
          <View key={index} style={styles.photoContainer}>
            <Image source={{ uri: photo }} style={styles.photo} />
            <TouchableOpacity
              style={styles.removePhoto}
              onPress={() => removePhoto(index)}
            >
              <Text style={styles.removePhotoText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
        {formData.photos.length < 6 && (
          <TouchableOpacity style={styles.addPhoto} onPress={pickImage}>
            <Text style={styles.addPhotoText}>+</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <Text style={styles.photoHint}>
        Добавьте от 1 до 6 фотографий. Первая фото будет основной.
      </Text>
    </View>
  );

  const renderInfoStep = () => (
    <View style={styles.stepContent}>
      <Input
        label="Имя и фамилия *"
        placeholder="Введите ваше имя"
        value={formData.name}
        onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
      />
      
      <Input
        label="Возраст *"
        placeholder="18"
        value={formData.age}
        onChangeText={(text) => setFormData(prev => ({ ...prev, age: text }))}
        keyboardType="numeric"
        maxLength={2}
      />
      
      <View style={styles.cityContainer}>
        <Input
          label="Город *"
          placeholder="Выберите город"
          value={formData.city}
          onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
        />
        <Button
          title="📍"
          onPress={getCurrentLocation}
          size="small"
          style={styles.locationButton}
        />
      </View>
    </View>
  );

  const renderInterestsStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.interestsGrid}>
        {interestsList.map((interest) => (
          <TouchableOpacity
            key={interest}
            style={[
              styles.interestTag,
              formData.interests.includes(interest) && styles.selectedInterest,
            ]}
            onPress={() => toggleInterest(interest)}
          >
            <Text
              style={[
                styles.interestText,
                formData.interests.includes(interest) && styles.selectedInterestText,
              ]}
            >
              {interest}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderBioStep = () => (
    <View style={styles.stepContent}>
      <Input
        label="О себе (необязательно)"
        placeholder="Расскажите немного о себе, ваших увлечениях и том, что ищете..."
        value={formData.bio}
        onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
        multiline
        numberOfLines={4}
        style={styles.bioInput}
      />
      <Text style={styles.bioHint}>
        Хорошее описание увеличивает шансы на взаимные лайки!
      </Text>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderPhotoStep();
      case 1:
        return renderInfoStep();
      case 2:
        return renderInterestsStep();
      case 3:
        return renderBioStep();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index <= currentStep && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
          <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
          <Text style={styles.stepSubtitle}>{steps[currentStep].subtitle}</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {renderStepContent()}
        </ScrollView>

        <View style={styles.footer}>
          <Button
            title={currentStep === steps.length - 1 ? 'Завершить' : 'Далее'}
            onPress={handleNext}
          />
          {currentStep > 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentStep(currentStep - 1)}
            >
              <Text style={styles.backButtonText}>Назад</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  progressContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  progressDot: {
    width: spacing.md,
    height: spacing.md,
    borderRadius: spacing.md / 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: spacing.xs,
  },
  progressDotActive: {
    backgroundColor: '#FF6B6B',
  },
  stepTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.sm,
  },
  stepSubtitle: {
    fontSize: adaptiveStyles.fontSize,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  stepContent: {
    paddingVertical: spacing.lg,
  },
  photoContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  photo: {
    width: wp(28),
    height: hp(20),
    borderRadius: deviceSizes.borderRadius.medium,
  },
  removePhoto: {
    position: 'absolute',
    top: -spacing.sm,
    right: -spacing.sm,
    width: spacing.xl,
    height: spacing.xl,
    borderRadius: spacing.sm,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removePhotoText: {
    color: '#FFFFFF',
    fontSize: fontSize.lg,
    fontWeight: 'bold',
  },
  addPhoto: {
    width: wp(20),  
    height: hp(20),
    borderRadius: deviceSizes.borderRadius.medium,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    fontSize: fontSize.huge * 1.5,
    color: '#CCCCCC',
  },
  photoHint: {
    fontSize: fontSize.md,
    color: '#666',
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  cityContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  locationButton: {
    marginLeft: spacing.sm,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  interestTag: {
    backgroundColor: '#F0F0F0',
    borderRadius: deviceSizes.borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    margin: spacing.xs,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedInterest: {
    backgroundColor: '#FF6B6B',
    borderColor: '#FF6B6B',
  },
  interestText: {
    fontSize: fontSize.md,
    color: '#666',
    fontWeight: '500',
  },
  selectedInterestText: {
    color: '#FFFFFF',
  },
  bioInput: {
    height: hp(12),
    textAlignVertical: 'top',
  },
  bioHint: {
    fontSize: fontSize.sm,
    color: '#999',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    paddingBottom: hp(3),
  },
  backButton: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  backButtonText: {
    fontSize: adaptiveStyles.fontSize,
    color: '#666',
  },
});
