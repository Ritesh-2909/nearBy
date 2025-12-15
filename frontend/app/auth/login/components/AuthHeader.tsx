import React from 'react';
import { View, Text } from 'react-native';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View className="items-center mb-8">
      <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-6 shadow-lg">
        <Text className="text-3xl">🔐</Text>
      </View>
      <Text className="text-3xl font-bold text-gray-900 mb-2">{title}</Text>
      <Text className="text-base text-gray-600 text-center px-4">{subtitle}</Text>
    </View>
  );
}
