import React, { useState, useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { Vendor } from '../types';

interface MapViewProps {
  vendors: Vendor[];
  onVendorPress?: (vendor: Vendor) => void;
  onLongPress?: (coordinate: { latitude: number; longitude: number }) => void;
}

export function MapViewComponent({ vendors, onVendorPress, onLongPress }: MapViewProps) {
  const router = useRouter();
  const [region, setRegion] = useState({
    latitude: 28.6139, // Default to Delhi
    longitude: 77.2090,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleMapLongPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    
    Alert.alert(
      'Add Vendor',
      'Add a vendor at this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add Vendor',
          onPress: () => {
            if (onLongPress) {
              onLongPress({ latitude, longitude });
            } else {
              router.push({
                pathname: '/vendors/add',
                params: { lat: latitude.toString(), lng: longitude.toString() },
              } as any);
            }
          },
        },
      ]
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      Grocery: '🛒',
      Hardware: '🔧',
      Food: '🍔',
      Service: '🛠️',
    };
    return icons[category] || '📍';
  };

  return (
    <View className="flex-1">
      <MapView
        style={{ flex: 1 }}
        region={region}
        onRegionChangeComplete={setRegion}
        onLongPress={handleMapLongPress}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {vendors.map((vendor) => {
          if (!vendor.location?.coordinates) return null;
          const [lng, lat] = vendor.location.coordinates;
          
          return (
            <Marker
              key={vendor._id}
              coordinate={{ latitude: lat, longitude: lng }}
              title={vendor.name}
              description={vendor.category}
              onPress={() => onVendorPress?.(vendor)}
            >
              <View className="items-center justify-center">
                <View className={`w-10 h-10 rounded-full items-center justify-center ${
                  vendor.status === 'approved' ? 'bg-orange-500' : 'bg-gray-400'
                }`}>
                  <Text className="text-lg">{getCategoryIcon(vendor.category)}</Text>
                </View>
                {vendor.status === 'pending' && (
                  <View className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border border-white" />
                )}
              </View>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

