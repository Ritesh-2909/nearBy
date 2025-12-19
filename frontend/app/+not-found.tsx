import { View, Text, TouchableOpacity } from 'react-native';
import { Link, Stack } from 'expo-router';
import React from 'react';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found' }} />
      <View className="flex-1 justify-center items-center bg-white px-5">
        <Text className="text-6xl mb-4">🗺️</Text>
        <Text className="text-2xl font-bold text-gray-800 mb-2">404 - Page Not Found</Text>
        <Text className="text-gray-600 text-center mb-8">
          Oops! The page you're looking for doesn't exist.
        </Text>
        <Link href="/" asChild>
          <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-lg">
            <Text className="text-white font-semibold text-base">Go to Home</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}
