import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export function SubmissionsHeader() {
  const router = useRouter();
  
  return (
    <View className="bg-white px-5 pt-12 pb-4 border-b border-gray-200">
      <View className="flex-row items-center mb-2">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Text className="text-2xl">←</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">Moderation</Text>
      </View>
      <Text className="text-base text-gray-700 ml-10">Pending Vendors</Text>
    </View>
  );
}



