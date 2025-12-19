import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

interface AuthLinkProps {
  text: string;
  linkText: string;
  onPress: () => void;
}

export function AuthLink({ text, linkText, onPress }: AuthLinkProps) {
  return (
    <TouchableOpacity className="mt-6 items-center" onPress={onPress}>
      <Text className="text-gray-600 text-base">
        {text}{' '}
        <Text className="text-primary font-bold">{linkText}</Text>
      </Text>
    </TouchableOpacity>
  );
}
