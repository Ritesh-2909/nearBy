import React from 'react';
import { View, Text } from 'react-native';

interface Feature {
  icon: string;
  text: string;
  description: string;
}

const features: Feature[] = [
  { icon: '📍', text: 'Find vendors nearby', description: 'Discover local businesses around you' },
  { icon: '🔍', text: 'Search by category', description: 'Filter by groceries, electronics, and more' },
  { icon: '➕', text: 'Add missing vendors', description: 'Help grow the community database' },
];

export function FeatureList() {
  return (
    <View className="w-full px-6 mt-4">
      {features.map((feature, index) => (
        <View 
          key={index} 
          className="flex-row items-start mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100"
        >
          <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-4 shadow-sm">
            <Text className="text-2xl">{feature.icon}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900 mb-1">{feature.text}</Text>
            <Text className="text-sm text-gray-600 leading-5">{feature.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
