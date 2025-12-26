import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/providers/auth-provider';
import { storage } from '../../services/storage';
import { ProfileHeader } from './_components/ProfileHeader';
import { ProfileSection } from './_components/ProfileSection';
import { ProfileButton } from './_components/ProfileButton';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Error', 'Name and email are required');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement update user API endpoint
      // For now, just update local storage
      await storage.setUser({
        ...user!,
        name: name.trim(),
        email: email.trim(),
      });
      await refreshUser();
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <ProfileHeader user={user} />
      
      <View className="px-5 py-4">
        <ProfileSection title="Account Information">
          <View className="bg-white rounded-xl p-4 border border-gray-200">
            <View className="mb-4">
              <Text className="text-xs text-gray-500 mb-2">Name</Text>
              {isEditing ? (
                <TextInput
                  className="bg-gray-50 rounded-lg px-4 py-3 text-base text-gray-900 border border-gray-300"
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                />
              ) : (
                <Text className="text-base text-gray-900">{user?.name || 'Not set'}</Text>
              )}
            </View>
            
            <View className="mb-4">
              <Text className="text-xs text-gray-500 mb-2">Email</Text>
              {isEditing ? (
                <TextInput
                  className="bg-gray-50 rounded-lg px-4 py-3 text-base text-gray-900 border border-gray-300"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text className="text-base text-gray-900">{user?.email || 'Not set'}</Text>
              )}
            </View>

            <View>
              <Text className="text-xs text-gray-500 mb-2">Role</Text>
              <Text className="text-base text-gray-900 capitalize">
                {user?.role || 'User'}
              </Text>
            </View>
          </View>
        </ProfileSection>

        <View className="mt-4">
          {isEditing ? (
            <View className="flex-row" style={{ gap: 12 }}>
              <ProfileButton
                title="Cancel"
                onPress={() => {
                  setIsEditing(false);
                  setName(user?.name || '');
                  setEmail(user?.email || '');
                }}
                variant="secondary"
              />
              <ProfileButton
                title="Save"
                onPress={handleSave}
                loading={loading}
                variant="primary"
              />
            </View>
          ) : (
            <ProfileButton
              title="Edit Profile"
              onPress={() => setIsEditing(true)}
              variant="primary"
            />
          )}
        </View>

        <View className="mt-6">
          <ProfileSection title="Actions">
            <TouchableOpacity
              className="bg-white rounded-xl p-4 border border-gray-200 mb-3"
              onPress={() => router.push('/submissions')}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-3">📝</Text>
                  <Text className="text-base text-gray-900">My Submissions</Text>
                </View>
                <Text className="text-gray-400">→</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-white rounded-xl p-4 border border-gray-200"
              onPress={handleLogout}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-3">🚪</Text>
                  <Text className="text-base text-red-600">Logout</Text>
                </View>
                <Text className="text-gray-400">→</Text>
              </View>
            </TouchableOpacity>
          </ProfileSection>
        </View>
      </View>
    </ScrollView>
  );
}

