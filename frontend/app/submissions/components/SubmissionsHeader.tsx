import React from 'react';
import { View, Text } from 'react-native';

export function SubmissionsHeader() {
  return (
    <View className="bg-white p-5 border-b border-gray-200">
      <Text className="text-2xl font-bold text-gray-800">My Submissions</Text>
    </View>
  );
}
