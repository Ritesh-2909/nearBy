import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type ViewType = 'list' | 'map';

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <View className="absolute top-20 right-4 z-10 bg-white rounded-lg shadow-lg flex-row border border-gray-200">
      <TouchableOpacity
        className={`px-4 py-2 rounded-l-lg ${
          currentView === 'list' ? 'bg-orange-500' : 'bg-white'
        }`}
        onPress={() => onViewChange('list')}
      >
        <Text className={`text-sm font-semibold ${
          currentView === 'list' ? 'text-white' : 'text-gray-700'
        }`}>
          List
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`px-4 py-2 rounded-r-lg ${
          currentView === 'map' ? 'bg-orange-500' : 'bg-white'
        }`}
        onPress={() => onViewChange('map')}
      >
        <Text className={`text-sm font-semibold ${
          currentView === 'map' ? 'text-white' : 'text-gray-700'
        }`}>
          Map
        </Text>
      </TouchableOpacity>
    </View>
  );
}



