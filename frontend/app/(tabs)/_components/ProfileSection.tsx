import React from 'react';
import { View, Text } from 'react-native';

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

export function ProfileSection({ title, children }: ProfileSectionProps) {
  return (
    <View>
      <Text className="text-sm font-semibold text-gray-700 mb-3">{title}</Text>
      {children}
    </View>
  );
}

