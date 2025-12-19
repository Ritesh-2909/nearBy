import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export function AddVendorHeader() {
  const router = useRouter();
  
  return (
    <View className="bg-white px-5 pt-12 pb-4 border-b border-gray-200">
      <View className="flex-row items-center mb-2">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Add vendor</Text>
      </View>
    </View>
  );
}



