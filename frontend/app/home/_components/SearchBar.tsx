import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { TextField } from '../../../src/components/ui';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View className="px-4 py-3 bg-white border-b border-gray-100">
      <TextField
        placeholder="Search for broom, tea, veggies..."
        value={value}
        onChangeText={onChangeText}
        variant="default"
        containerClassName="mb-0"
        className="bg-gray-50 border-gray-200"
        leftElement={<Text className="text-lg">🔍</Text>}
        rightElement={
          value.length > 0 ? (
            <TouchableOpacity onPress={() => onChangeText('')}>
              <Text className="text-gray-400 text-lg">✕</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />
    </View>
  );
}



