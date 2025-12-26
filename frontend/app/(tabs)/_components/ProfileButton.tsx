import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ProfileButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export function ProfileButton({ 
  title, 
  onPress, 
  loading = false,
  variant = 'primary' 
}: ProfileButtonProps) {
  const isPrimary = variant === 'primary';
  
  return (
    <TouchableOpacity
      className={`flex-1 rounded-xl py-4 items-center justify-center ${
        isPrimary ? 'bg-orange-500' : 'bg-gray-200'
      }`}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#374151'} />
      ) : (
        <Text
          className={`text-base font-semibold ${
            isPrimary ? 'text-white' : 'text-gray-700'
          }`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

