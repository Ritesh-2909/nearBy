import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

interface ActionButtonsProps {
  onGetStarted: () => void;
  onLogin: () => void;
  loading: boolean;
}

export function ActionButtons({ onGetStarted, onLogin, loading }: ActionButtonsProps) {
  return (
    <View className="pb-8 px-6">
      <TouchableOpacity
        className={`bg-blue-500 p-4 rounded-xl items-center mb-4 shadow-lg ${loading ? 'opacity-60' : ''}`}
        onPress={onGetStarted}
        disabled={loading}
        style={{ elevation: 4 }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-lg font-bold">Get Started</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-white border-2 border-blue-500 p-4 rounded-xl items-center shadow-sm"
        onPress={onLogin}
        disabled={loading}
      >
        <Text className="text-blue-500 text-lg font-semibold">Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
