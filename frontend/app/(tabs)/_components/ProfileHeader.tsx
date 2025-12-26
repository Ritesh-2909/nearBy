import React from 'react';
import { View, Text } from 'react-native';

interface ProfileHeaderProps {
  user: { name: string; email: string; role?: string } | null;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const initials = user?.name
    ? user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <View className="bg-white px-5 pt-12 pb-8 border-b border-gray-200">
      <View className="items-center">
        <View className="w-24 h-24 bg-orange-500 rounded-full items-center justify-center mb-4">
          <Text className="text-3xl font-bold text-white">{initials}</Text>
        </View>
        <Text className="text-xl font-bold text-gray-900 mb-1">
          {user?.name || 'Guest User'}
        </Text>
        <Text className="text-sm text-gray-600">{user?.email || 'No email'}</Text>
        {user?.role && (
          <View className="mt-2 px-3 py-1 bg-orange-100 rounded-full">
            <Text className="text-xs text-orange-700 font-medium capitalize">
              {user.role}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

