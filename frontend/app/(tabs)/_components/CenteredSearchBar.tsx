import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { TextField } from '../../../src/components/ui';

interface CenteredSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function CenteredSearchBar({ value, onChangeText }: CenteredSearchBarProps) {
  return (
    <View className="flex-1 justify-center items-center px-5">
      <View className="w-full max-w-md">
        <TextField
          placeholder="Search for vendors, shops, stalls..."
          value={value}
          onChangeText={onChangeText}
          variant="default"
          containerClassName="mb-0"
          className="bg-gray-50 border-gray-200"
          leftElement={<Text className="text-xl">🔍</Text>}
          rightElement={
            value.length > 0 ? (
              <TouchableOpacity onPress={() => onChangeText('')}>
                <Text className="text-gray-400 text-lg">✕</Text>
              </TouchableOpacity>
            ) : undefined
          }
        />
        {value.length > 0 && (
          <Text className="text-sm text-gray-500 mt-3 text-center">
            Press Enter to search for "{value}"
          </Text>
        )}
      </View>
    </View>
  );
}

