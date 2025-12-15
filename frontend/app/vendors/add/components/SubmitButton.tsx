import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface SubmitButtonProps {
  onPress: () => void;
  loading: boolean;
}

export function SubmitButton({ onPress, loading }: SubmitButtonProps) {
  return (
    <TouchableOpacity
      className={`bg-blue-500 p-4 m-4 rounded-lg items-center ${loading ? 'opacity-60' : ''}`}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-white text-lg font-semibold">Submit Vendor</Text>
      )}
    </TouchableOpacity>
  );
}

