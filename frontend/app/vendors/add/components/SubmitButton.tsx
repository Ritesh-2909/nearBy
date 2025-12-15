import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface SubmitButtonProps {
  onPress: () => void;
  loading: boolean;
}

export function SubmitButton({ onPress, loading }: SubmitButtonProps) {
  return (
    <TouchableOpacity
      tw={`bg-primary p-4 m-4 rounded-lg items-center ${loading ? 'opacity-60' : ''}`}
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
