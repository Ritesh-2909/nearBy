import React from 'react';
import { View, Text } from 'react-native';

export function ComingSoonIllustration() {
  return (
    <View className="items-center justify-center">
      <View className="w-48 h-48 bg-orange-100 rounded-full items-center justify-center mb-4">
        <Text className="text-8xl">👥</Text>
      </View>
      <View className="flex-row items-center mt-4">
        <View className="w-3 h-3 bg-orange-500 rounded-full mx-1" />
        <View className="w-3 h-3 bg-orange-300 rounded-full mx-1" />
        <View className="w-3 h-3 bg-orange-200 rounded-full mx-1" />
      </View>
    </View>
  );
}

