import React from 'react';
import { View, Text } from 'react-native';

export function OnboardingHeader() {
  return (
    <View className="items-center mb-8">
      <View className="w-24 h-24 bg-primary rounded-full items-center justify-center mb-6 shadow-lg">
        <Text className="text-5xl">📍</Text>
      </View>
      <Text className="text-4xl font-bold text-gray-900 mb-3">nearBy</Text>
      <Text className="text-lg text-gray-600 text-center px-4 leading-6">
        Discover small vendors near you
      </Text>
    </View>
  );
}


