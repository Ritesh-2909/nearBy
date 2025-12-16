import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Vendor } from '../types';
import { formatDistance, getCategoryColor } from '../utils';

import { useRouter } from 'expo-router';

interface VendorListProps {
  searchQuery: string;
  category: string | null;
  distance: string | null;
  vendors: Vendor[];
}

export function VendorList({ vendors }: VendorListProps) {
  const router = useRouter();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const renderVendor = ({ item }: { item: Vendor }) => {
    const timeStr = item.createdAt ? formatTime(item.createdAt) : '00:00';
    const isFavorite = false; // TODO: Get from state
    
    return (
      <TouchableOpacity 
        className="bg-white p-4 rounded-xl mb-3 mx-4 shadow-sm border border-gray-100"
        style={{ elevation: 2 }}
        onPress={() => router.push(`/vendors/${item._id}`)}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            {/* Profile Picture */}
            <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center mr-3">
              <Text className="text-xl">👤</Text>
            </View>
            
            <View className="flex-1">
              <View className="flex-row items-center">
                <Text className="text-base font-semibold text-gray-900">{item.name}</Text>
                {item.status === 'pending' && (
                  <View className="ml-2 px-2 py-0.5 bg-yellow-100 rounded">
                    <Text className="text-xs text-yellow-700">Pending</Text>
                  </View>
                )}
              </View>
              <Text className="text-xs text-gray-500 mt-0.5">{item.category} • {timeStr}</Text>
              {item.distance && (
                <Text className="text-xs text-gray-400 mt-0.5">{formatDistance(item.distance)}</Text>
              )}
            </View>
          </View>
          
          {/* Action Button */}
          <TouchableOpacity
            className={`w-8 h-8 rounded-full items-center justify-center ${
              isFavorite ? 'bg-orange-500' : 'bg-gray-100'
            }`}
          >
            <Text className={`text-sm ${isFavorite ? 'text-white' : 'text-gray-400'}`}>
              {isFavorite ? '✓' : '→'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (vendors.length === 0) {
    return (
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-lg text-gray-600 mb-5">No vendors found</Text>
        <Text className="text-sm text-gray-500 text-center">
          Try adjusting your search or category filter
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={vendors}
      renderItem={renderVendor}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ paddingVertical: 10 }}
    />
  );
}

