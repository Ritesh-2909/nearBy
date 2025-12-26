import React from 'react';
import { View, Text } from 'react-native';
import { Logo } from '../../../../src/components/Logo';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <View className="items-center mb-8">
      <Logo size="large" showText={true} variant="full" />
      <Text className="text-2xl font-bold text-white mt-6 mb-2">{title}</Text>
      <Text className="text-base text-gray-300 text-center px-4">{subtitle}</Text>
    </View>
  );
}
