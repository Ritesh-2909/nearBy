import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const DISTANCES = ['1 km', '2 km', '5 km', '10 km', 'All']; // All fetches all vendors

interface DistanceFilterProps {
  selectedDistance: string | null;
  onDistanceSelect: (distance: string | null) => void;
}

export function DistanceFilter({ selectedDistance, onDistanceSelect }: DistanceFilterProps) {
  return (
    <View className="bg-white px-4 py-2 border-b border-gray-100">
      <View className="flex-row items-center space-x-3">
        {DISTANCES.map((distance) => (
          <TouchableOpacity
            key={distance}
            onPress={() => onDistanceSelect(selectedDistance === distance ? null : distance)}
          >
            <Text
              className={`text-sm px-2 py-1 rounded-full ${
                selectedDistance === distance ? 'text-gray-900 font-semibold bg-orange-100' : 'text-gray-500'
              }`}
            >
              {distance}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}



