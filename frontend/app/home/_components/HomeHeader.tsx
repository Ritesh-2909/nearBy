import React from 'react';
import { View, Text } from 'react-native';

export function HomeHeader() {
  return (
    <View className="bg-white px-5 pt-12 pb-5 border-b border-gray-200">
      <View className="flex-row items-center">
        <Text className="text-2xl font-bold text-gray-900">near</Text>
        <View className="flex-row items-center">
          <Text className="text-2xl font-bold text-gray-900">B</Text>
          <View className="w-2 h-2 bg-orange-500 rounded-full mx-0.5" />
          <Text className="text-2xl font-bold text-gray-900">y</Text>
        </View>
      </View>
      <Text className="text-sm text-gray-600 mt-1">Find nearby stalls & shops</Text>
    </View>
  );
}



