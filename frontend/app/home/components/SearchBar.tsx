import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBar({ value, onChangeText }: SearchBarProps) {
  return (
    <View className="px-4 py-3 bg-white border-b border-gray-100">
      <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
        <Text className="text-lg mr-3">🔍</Text>
        <TextInput
          className="flex-1 text-base text-gray-900"
          placeholder="Search vendors..."
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
        />
        {value.length > 0 && (
          <TouchableOpacity 
            className="ml-2"
            onPress={() => onChangeText('')}
          >
            <Text className="text-gray-400 text-lg">✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
