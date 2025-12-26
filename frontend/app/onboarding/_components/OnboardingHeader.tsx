import React from 'react';
import { View, Text } from 'react-native';
import { Logo } from '../../../src/components/Logo';

export function OnboardingHeader() {
  return (
    <View className="items-center mb-8 pt-12">
      <Logo size="large" showText={true} variant="full" />
      <Text className="text-lg text-gray-300 text-center px-4 leading-6 mt-4">
        Discover small vendors near you
      </Text>
    </View>
  );
}


