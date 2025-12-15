import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Router } from 'expo-router';

interface FloatingActionsProps {
  router: Router;
}

export function FloatingActions({ router }: FloatingActionsProps) {
  return (
    <View className="absolute right-5 bottom-6">
      <TouchableOpacity
        className="w-14 h-14 rounded-full bg-blue-500 justify-center items-center mb-3"
        onPress={() => router.push('/vendors/add')}
        style={{ elevation: 8 }}
      >
        <Text className="text-2xl text-white">➕</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-14 h-14 rounded-full bg-purple-500 justify-center items-center"
        onPress={() => router.push('/submissions')}
        style={{ elevation: 8 }}
      >
        <Text className="text-xl text-white">📋</Text>
      </TouchableOpacity>
    </View>
  );
}
