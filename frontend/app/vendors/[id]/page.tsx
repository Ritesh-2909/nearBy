import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView from 'react-native-maps';
import { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { vendorsAPI } from '../../../services/api';
import { Vendor } from '../../home/types';

export default function VendorDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendor();
  }, [id]);

  const loadVendor = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await vendorsAPI.getVendor(id as string);
      // setVendor(response.data);
      
      // Mock data for now
      setVendor({
        _id: id as string,
        name: 'Sample Vendor',
        category: 'Grocery',
        description: 'Fresh vegetables and daily essentials',
        address: '123 Main Street',
        phone: '+1234567890',
        location: {
          type: 'Point',
          coordinates: [77.2090, 28.6139],
        },
        status: 'approved',
      });
    } catch (error) {
      console.error('Error loading vendor:', error);
      Alert.alert('Error', 'Could not load vendor details');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (vendor?.phone) {
      Linking.openURL(`tel:${vendor.phone}`);
    }
  };

  const handleNavigate = () => {
    if (vendor?.location?.coordinates) {
      const [lng, lat] = vendor.location.coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600">Loading...</Text>
      </View>
    );
  }

  if (!vendor) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600">Vendor not found</Text>
      </View>
    );
  }

  const [lng, lat] = vendor.location?.coordinates || [77.2090, 28.6139];

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white px-5 pt-12 pb-4 border-b border-gray-200">
        <View className="flex-row items-center mb-2">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-900 flex-1">{vendor.name}</Text>
        </View>
        <View className="ml-10">
          <View className="flex-row items-center">
            <View className="px-3 py-1 bg-orange-100 rounded-full mr-2">
              <Text className="text-xs font-semibold text-orange-700">{vendor.category}</Text>
            </View>
            {vendor.status === 'pending' && (
              <View className="px-3 py-1 bg-yellow-100 rounded-full">
                <Text className="text-xs font-semibold text-yellow-700">Pending</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Map */}
      {vendor.location && (
        <View className="h-64 my-4 mx-4 rounded-lg overflow-hidden border border-gray-200">
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            initialRegion={{
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
          >
            <Marker coordinate={{ latitude: lat, longitude: lng }} />
          </MapView>
        </View>
      )}

      {/* Details */}
      <View className="px-5 pb-6">
        {vendor.description && (
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">Description</Text>
            <Text className="text-sm text-gray-700 leading-5">{vendor.description}</Text>
          </View>
        )}

        {vendor.address && (
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">Address</Text>
            <Text className="text-sm text-gray-700">{vendor.address}</Text>
          </View>
        )}

        {vendor.tags && vendor.tags.length > 0 && (
          <View className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">Tags</Text>
            <View className="flex-row flex-wrap">
              {vendor.tags.map((tag, index) => (
                <View key={index} className="px-3 py-1 bg-gray-100 rounded-full mr-2 mb-2">
                  <Text className="text-xs text-gray-700">{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View className="mt-6 space-y-3">
          {vendor.phone && (
            <TouchableOpacity
              className="bg-orange-500 p-4 rounded-lg items-center"
              onPress={handleCall}
            >
              <Text className="text-white font-semibold">📞 Call Vendor</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            className="bg-black p-4 rounded-lg items-center"
            onPress={handleNavigate}
          >
            <Text className="text-white font-semibold">🧭 Navigate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

