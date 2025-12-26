import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { HomeHeader } from './_components/HomeHeader';
import { SearchBar } from './_components/SearchBar';
import { DistanceFilter } from './_components/DistanceFilter';
import { CategoryFilter } from './_components/CategoryFilter';
import { VendorList } from './_components/VendorList';
import { MapViewComponent } from './_components/MapView';
import { ViewToggle } from './_components/ViewToggle';
import { EmptyState } from './_components/EmptyState';
import { FloatingActions } from './_components/FloatingActions';
import { fetchNearbyVendors, filterVendors } from './utils';
import { Vendor } from './types';

type ViewType = 'list' | 'map';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistance, setSelectedDistance] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    console.log('📱 [Page] Home page initialized');
    loadVendors();
  }, []);

  useEffect(() => {
    if (userLocation) {
      loadVendors();
    }
  }, [selectedDistance, selectedCategory, searchQuery]);

  const loadVendors = async () => {
    try {
      setLoading(true);
      
      // Get user location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });

      // Convert distance filter to meters
      const radius = selectedDistance 
        ? parseInt(selectedDistance) * 1000 
        : 3000;

      const fetchedVendors = await fetchNearbyVendors(latitude, longitude, {
        searchQuery,
        category: selectedCategory,
        radius,
      });

      // Filter to only show approved vendors (except user's own pending)
      const filtered = fetchedVendors.filter(v => 
        v.status === 'approved' || v.status === undefined
      );

      setVendors(filtered);
    } catch (error) {
      console.error('Error loading vendors:', error);
      // Use mock data as fallback
      setVendors([
        {
          _id: '1',
          name: 'Grocery',
          category: 'Grocery',
          distance: 150,
          description: 'Fresh vegetables and daily essentials',
          createdAt: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString(),
          location: {
            type: 'Point',
            coordinates: [77.2090, 28.6139],
          },
          status: 'approved',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleVendorPress = (vendor: Vendor) => {
    router.push(`/vendors/${vendor._id}`);
  };

  const handleMapLongPress = (coordinate: { latitude: number; longitude: number }) => {
    router.push({
      pathname: '/vendors/add',
      params: {
        lat: coordinate.latitude.toString(),
        lng: coordinate.longitude.toString(),
      },
    } as any);
  };

  const filteredVendors = filterVendors(vendors, {
    searchQuery,
    category: selectedCategory,
  });

  return (
    <View className="flex-1 bg-gray-50">
      <HomeHeader />
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <DistanceFilter
        selectedDistance={selectedDistance}
        onDistanceSelect={setSelectedDistance}
      />
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      
      <ViewToggle currentView={currentView} onViewChange={setCurrentView} />
      
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Loading...</Text>
        </View>
      ) : filteredVendors.length === 0 ? (
        <EmptyState 
          message={searchQuery || selectedCategory ? "No vendors match your search" : "No vendors found nearby"}
          showAddButton={true}
        />
      ) : currentView === 'map' ? (
        <MapViewComponent
          vendors={filteredVendors}
          onVendorPress={handleVendorPress}
          onLongPress={handleMapLongPress}
        />
      ) : (
        <VendorList 
          searchQuery={searchQuery}
          category={selectedCategory}
          distance={selectedDistance}
          vendors={filteredVendors}
        />
      )}
      
      {currentView === 'list' && <FloatingActions router={router} />}
    </View>
  );
}

