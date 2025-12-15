import React from 'react';
import { View, Text } from 'react-native';

export function AddVendorHeader() {
  return (
    <View className="p-5 border-b border-gray-200">
      <Text className="text-2xl font-bold text-gray-800 mb-1">Add Vendor</Text>
      <Text className="text-sm text-gray-600">This will go live after review</Text>
    </View>
  );
}
