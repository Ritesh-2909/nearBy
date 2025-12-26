import React, { useState, useEffect } from 'react';
import { View, Text, Alert, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
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
    latitude: 12.9716, // Default to Bangalore
    longitude: 77.5946,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Update region when vendors change to show all vendors
  useEffect(() => {
    if (vendors.length > 0) {
      const coordinates = vendors
        .map(v => v.location?.coordinates)
        .filter(Boolean) as [number, number][];
      
      if (coordinates.length > 0) {
        const lats = coordinates.map(c => c[1]);
        const lngs = coordinates.map(c => c[0]);
        
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        
        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;
        const latDelta = Math.max(maxLat - minLat, 0.01) * 1.5;
        const lngDelta = Math.max(maxLng - minLng, 0.01) * 1.5;
        
        setRegion({
          latitude: centerLat,
          longitude: centerLng,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta,
        });
      }
    }
  }, [vendors]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      setUserLocation({ latitude, longitude });
      
      // If no vendors, center on user location
      if (vendors.length === 0) {
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
      }
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

  // Handle map errors gracefully
  const handleMapError = (error: any) => {
    console.error('Map error:', error);
    setMapError('Map failed to load. Please check your internet connection.');
  };

  if (mapError) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 px-6">
        <Text className="text-4xl mb-4">🗺️</Text>
        <Text className="text-lg font-semibold text-gray-900 mb-2 text-center">
          Map Unavailable
        </Text>
        <Text className="text-sm text-gray-600 text-center mb-4">
          {mapError}
        </Text>
        <Text className="text-xs text-gray-500 text-center">
          You can still browse vendors in list view
        </Text>
      </View>
    );
  }

  if (vendors.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100 px-6">
        <Text className="text-6xl mb-4">📍</Text>
        <Text className="text-lg font-semibold text-gray-900 mb-2 text-center">
          No vendors to display
        </Text>
        <Text className="text-sm text-gray-600 text-center mb-6">
          Try adjusting your filters or add a vendor
        </Text>
        <TouchableOpacity
          className="bg-orange-500 px-6 py-3 rounded-lg"
          onPress={() => router.push('/vendors/add')}
        >
          <Text className="text-white font-semibold">Add Vendor</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ minHeight: 400 }}>
      {!mapReady && (
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1,
        }}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text className="text-gray-600 mt-2">Loading map...</Text>
        </View>
      )}
      <MapView
        style={{ flex: 1, width: '100%', height: '100%' }}
        initialRegion={region}
        region={region}
        onRegionChangeComplete={setRegion}
        onLongPress={handleMapLongPress}
        onMapReady={() => setMapReady(true)}
        onError={handleMapError}
        showsUserLocation={true}
        showsMyLocationButton={Platform.OS === 'android'}
        mapType="standard"
        loadingEnabled={true}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
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
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: vendor.status === 'approved' ? '#FF6B35' : '#9CA3AF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: '#FFFFFF',
                }}>
                  <Text style={{ fontSize: 18 }}>{getCategoryIcon(vendor.category)}</Text>
                </View>
                {vendor.status === 'pending' && (
                  <View style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 12,
                    height: 12,
                    backgroundColor: '#F59E0B',
                    borderRadius: 6,
                    borderWidth: 2,
                    borderColor: '#FFFFFF',
                  }} />
                )}
              </View>
            </Marker>
          );
        })}
        
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="blue"
          />
        )}
      </MapView>
    </View>
  );
}

