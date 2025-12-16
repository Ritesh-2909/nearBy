import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface SubmitButtonProps {
  onPress: () => void;
  loading: boolean;
}

export function SubmitButton({ onPress, loading }: SubmitButtonProps) {
  return (
    <View className="px-4 pb-4">
      <TouchableOpacity
        className={`bg-black p-4 rounded-lg items-center ${loading ? 'opacity-60' : ''}`}
        onPress={onPress}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-lg font-semibold">Submit for review</Text>
        )}
      </TouchableOpacity>
      <Text className="text-xs text-gray-500 text-center mt-2">
        Will be visible after approval
      </Text>
    </View>
  );
}

