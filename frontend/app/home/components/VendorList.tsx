import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Vendor } from '../types';
import { formatDistance, getCategoryColor } from '../utils';

interface VendorListProps {
  searchQuery: string;
  category: string | null;
}

// Mock data for now
const mockVendors: Vendor[] = [
  {
    _id: '1',
    name: 'Corner Store',
    category: 'Groceries',
    distance: 150,
    description: 'Fresh vegetables and daily essentials',
  },
  {
    _id: '2',
    name: 'Tech Hub',
    category: 'Electronics',
    distance: 300,
    description: 'Mobile phones and accessories',
  },
];

export function VendorList({ searchQuery, category }: VendorListProps) {
  const filteredVendors = mockVendors.filter((vendor) => {
    const matchesSearch = !searchQuery || 
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !category || vendor.category === category;
    return matchesSearch && matchesCategory;
  });

  const renderVendor = ({ item }: { item: Vendor }) => (
    <TouchableOpacity 
      className="bg-white p-4 rounded-xl mb-3 mx-4 shadow-sm border border-gray-100"
      style={{ elevation: 2 }}
    >
      <View className="flex-row items-start justify-between mb-2">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900 mb-1">{item.name}</Text>
          <View className="flex-row items-center mb-2">
            <View className={`px-2 py-1 rounded-md mr-2 ${getCategoryColor(item.category)}`}>
              <Text className="text-xs font-semibold">{item.category}</Text>
            </View>
            {item.distance && (
              <View className="flex-row items-center">
                <Text className="text-xs mr-1">📍</Text>
                <Text className="text-xs text-gray-600">{formatDistance(item.distance)}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      {item.description && (
        <Text className="text-sm text-gray-600 leading-5" numberOfLines={2}>
          {item.description}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (filteredVendors.length === 0) {
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
      data={filteredVendors}
      renderItem={renderVendor}
      keyExtractor={(item) => item._id}
      contentContainerStyle={{ paddingVertical: 10 }}
    />
  );
}

