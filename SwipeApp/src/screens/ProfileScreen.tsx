import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Button, Input, Calendar, CalendarEvent } from '../components';
import { useApp } from '../context/AppContext';
import { interestsList } from '../data/mockData';
import { 
  fontSize, 
  spacing, 
  getAdaptiveStyles,
  deviceSizes,
  wp,
  hp 
} from '../utils/responsive';

const adaptiveStyles = getAdaptiveStyles();

export const ProfileScreen: React.FC = () => {
  const { state, updateProfile, logout } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: state.currentUser?.name || '',
    age: state.currentUser?.age?.toString() || '',
    city: state.currentUser?.city || '',
    bio: state.currentUser?.bio || '',
    interests: state.currentUser?.interests || [],
    photos: state.currentUser?.photos || [],
  });

  const handleSave = () => {
    if (!editData.name.trim()) {
      Alert.alert('Ошибка', 'Введите имя');
      return;
    }

    const age = parseInt(editData.age);
    if (isNaN(age) || age < 18 || age > 100) {
      Alert.alert('Ошибка', 'Введите корректный возраст');
      return;
    }

    updateProfile({
      name: editData.name,
      age,
      city: editData.city,
      bio: editData.bio,
      interests: editData.interests,
      photos: editData.photos,
    });

    setIsEditing(false);
    Alert.alert('Успешно', 'Профиль обновлен');
  };

  const handleCancel = () => {
    setEditData({
      name: state.currentUser?.name || '',
      age: state.currentUser?.age?.toString() || '',
      city: state.currentUser?.city || '',
      bio: state.currentUser?.bio || '',
      interests: state.currentUser?.interests || [],
      photos: state.currentUser?.photos || [],
    });
    setIsEditing(false);
  };

  const addPhoto = async () => {
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
      setEditData(prev => ({
        ...prev,
        photos: [...prev.photos, result.assets[0].uri],
      }));
    }
  };

  const removePhoto = (index: number) => {
    setEditData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const toggleInterest = (interest: string) => {
    setEditData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleLogout = () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти из аккаунта?',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Выйти', style: 'destructive', onPress: logout },
      ]
    );
  };

  if (!state.currentUser) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Профиль</Text>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => {
            Alert.alert('Настройки', 'Раздел настроек будет доступен в следующих версиях');
          }}
        >
          <Ionicons name="settings-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Фотографии */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Фотографии</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {(isEditing ? editData.photos : state.currentUser.photos).map((photo, index) => (
              <View key={index} style={styles.photoContainer}>
                <Image source={{ uri: photo }} style={styles.photo} />
                {isEditing && (
                  <TouchableOpacity
                    style={styles.removePhoto}
                    onPress={() => removePhoto(index)}
                  >
                    <Ionicons name="close" size={16} color="#FFF" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {isEditing && editData.photos.length < 6 && (
              <TouchableOpacity style={styles.addPhoto} onPress={addPhoto}>
                <Ionicons name="add" size={32} color="#CCCCCC" />
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Основная информация */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Основная информация</Text>
          {isEditing ? (
            <>
              <Input
                label="Имя"
                value={editData.name}
                onChangeText={(text) => setEditData(prev => ({ ...prev, name: text }))}
              />
              <Input
                label="Возраст"
                value={editData.age}
                onChangeText={(text) => setEditData(prev => ({ ...prev, age: text }))}
                keyboardType="numeric"
                maxLength={2}
              />
              <Input
                label="Город"
                value={editData.city}
                onChangeText={(text) => setEditData(prev => ({ ...prev, city: text }))}
              />
            </>
          ) : (
            <View style={styles.infoContainer}>
              <Text style={styles.infoText}>{state.currentUser.name}, {state.currentUser.age}</Text>
              <Text style={styles.infoSubtext}>{state.currentUser.city}</Text>
              {state.currentUser.phoneNumber && (
                <Text style={styles.infoSubtext}>{state.currentUser.phoneNumber}</Text>
              )}
            </View>
          )}
        </View>

        {/* О себе */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>О себе</Text>
          {isEditing ? (
            <Input
              placeholder="Расскажите о себе..."
              value={editData.bio}
              onChangeText={(text) => setEditData(prev => ({ ...prev, bio: text }))}
              multiline
              numberOfLines={4}
              style={styles.bioInput}
            />
          ) : (
            <Text style={styles.bioText}>
              {state.currentUser.bio || 'Добавьте описание о себе'}
            </Text>
          )}
        </View>

        {/* Интересы */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Интересы</Text>
          {isEditing ? (
            <View style={styles.interestsGrid}>
              {interestsList.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.interestTag,
                    editData.interests.includes(interest) && styles.selectedInterest,
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text
                    style={[
                      styles.interestText,
                      editData.interests.includes(interest) && styles.selectedInterestText,
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.interestsContainer}>
              {state.currentUser.interests.map((interest, index) => (
                <View key={index} style={styles.interestTagReadonly}>
                  <Text style={styles.interestTextReadonly}>{interest}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Календарь событий */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Календарь</Text>
          <Calendar 
            events={state.calendarEvents}
            onEventPress={(event) => {
              Alert.alert(
                event.title,
                `${event.description}\n\nДата: ${event.date.toLocaleDateString('ru-RU')} в ${event.time}`,
                [{ text: 'OK' }]
              );
            }}
            onAddEvent={() => {
              Alert.alert(
                'Добавить событие',
                'Функция добавления событий будет доступна в следующих версиях'
              );
            }}
            isEditable={isEditing}
          />
        </View>

        {/* Статистика */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Статистика</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{state.matches.length}</Text>
              <Text style={styles.statLabel}>Мэтчей</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{5 - state.users.length}</Text>
              <Text style={styles.statLabel}>Просмотрено</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{state.calendarEvents.filter(e => e.type === 'date').length}</Text>
              <Text style={styles.statLabel}>Свиданий</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Кнопки действий */}
      <View style={styles.footer}>
        {isEditing ? (
          <View style={styles.editButtons}>
            <Button
              title="Отмена"
              onPress={handleCancel}
              variant="outline"
              style={styles.editButton}
            />
            <Button
              title="Сохранить"
              onPress={handleSave}
              style={styles.editButton}
            />
          </View>
        ) : (
          <>
            <Button
              title="Редактировать профиль"
              onPress={() => setIsEditing(true)}
              style={styles.actionButton}
            />
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Выйти из аккаунта</Text>
            </TouchableOpacity>
          </>
        )}
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
  settingsButton: {
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  section: {
    marginVertical: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: '#333',
    marginBottom: spacing.lg,
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
  addPhoto: {
    width: wp(28),
    height: hp(20),
    borderRadius: deviceSizes.borderRadius.medium,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    paddingVertical: spacing.sm,
  },
  infoText: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: '#333',
    marginBottom: spacing.xs,
  },
  infoSubtext: {
    fontSize: adaptiveStyles.fontSize,
    color: '#666',
    marginBottom: spacing.xs / 2,
  },
  bioInput: {
    height: hp(12),
    textAlignVertical: 'top',
  },
  bioText: {
    fontSize: adaptiveStyles.fontSize,
    color: '#666',
    lineHeight: adaptiveStyles.fontSize * 1.4,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  interestTagReadonly: {
    backgroundColor: '#F0F0F0',
    borderRadius: deviceSizes.borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  interestTextReadonly: {
    fontSize: fontSize.md,
    color: '#666',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: spacing.lg,
    backgroundColor: '#F8F8F8',
    borderRadius: deviceSizes.borderRadius.medium,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: fontSize.xxxl,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  statLabel: {
    fontSize: fontSize.md,
    color: '#666',
    marginTop: spacing.xs,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    paddingBottom: hp(3),
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flex: 0.48,
  },
  actionButton: {
    marginBottom: spacing.lg,
  },
  logoutButton: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  logoutText: {
    fontSize: adaptiveStyles.fontSize,
    color: '#FF6B6B',
    fontWeight: '500',
  },
});
