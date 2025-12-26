import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

const CATEGORIES = [
  'Grocery',
  'Hardware',
  'Food',
  'Service',
];

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

export function CategoryFilter({ selectedCategory, onCategorySelect }: CategoryFilterProps) {
  return (
    <View className="bg-white py-3 border-b border-gray-100">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            className={`px-5 py-2.5 rounded-full mx-1.5 ${
              selectedCategory === category ? 'bg-orange-500' : 'bg-transparent'
            }`}
            onPress={() => onCategorySelect(selectedCategory === category ? null : category)}
            style={selectedCategory === category ? { elevation: 2 } : {}}
          >
            <Text
              className={`text-sm font-semibold ${
                selectedCategory === category ? 'text-white' : 'text-gray-700'
              }`}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

