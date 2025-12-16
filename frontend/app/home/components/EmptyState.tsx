import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface EmptyStateProps {
  message?: string;
  showAddButton?: boolean;
}

export function EmptyState({ 
  message = "No vendors found nearby",
  showAddButton = true 
}: EmptyStateProps) {
  const router = useRouter();

  return (
    <View className="flex-1 justify-center items-center px-6 py-12">
      <Text className="text-6xl mb-4">🔍</Text>
      <Text className="text-lg font-semibold text-gray-900 mb-2 text-center">
        {message}
      </Text>
      <Text className="text-sm text-gray-600 text-center mb-6">
        Try adjusting your search or filters
      </Text>
      {showAddButton && (
        <TouchableOpacity
          className="bg-orange-500 px-6 py-3 rounded-lg"
          onPress={() => router.push('/vendors/add')}
        >
          <Text className="text-white font-semibold">Can't find? Add nearby vendor</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

