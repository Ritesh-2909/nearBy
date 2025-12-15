import React from 'react';
import { View, Text } from 'react-native';

export function HomeHeader() {
  return (
    <View className="bg-white px-5 pt-12 pb-5 border-b border-gray-200">
      <View className="flex-row items-center mb-2">
        <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mr-3">
          <Text className="text-xl">📍</Text>
        </View>
        <View className="flex-1">
          <Text className="text-2xl font-bold text-gray-900">nearBy</Text>
          <Text className="text-sm text-gray-600 mt-0.5">Discover vendors near you</Text>
        </View>
      </View>
    </View>
  );
}
