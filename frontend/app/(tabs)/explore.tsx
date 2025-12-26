import React, { useEffect, useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { HomeHeader } from '../home/_components/HomeHeader';
import { SearchBar } from '../home/_components/SearchBar';
import { DistanceFilter } from '../home/_components/DistanceFilter';
import { CategoryFilter } from '../home/_components/CategoryFilter';
import { VendorList } from '../home/_components/VendorList';
import { MapViewComponent } from '../home/_components/MapView';
import { ViewToggle } from '../home/_components/ViewToggle';
import { EmptyState } from '../home/_components/EmptyState';
import { FloatingActions } from '../home/_components/FloatingActions';
import { fetchNearbyVendors, fetchAllVendors, filterVendors } from '../home/utils';
import { Vendor } from '../home/types';

type ViewType = 'list' | 'map';

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistance, setSelectedDistance] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('list'); // List is default
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null); // Keep for potential future use

  const loadVendors = useCallback(async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        setVendors([]);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      const newLocation = { latitude, longitude };
      setUserLocation(newLocation);

      // Use /vendors/all route when "All" is selected, otherwise use /vendors/nearby
      let fetchedVendors: Vendor[] = [];
      
      if (selectedDistance === 'All') {
        fetchedVendors = await fetchAllVendors(latitude, longitude, {
          searchQuery,
          category: selectedCategory,
        });
      } else {
        // Parse distance from string like "1 km" -> 1000 meters
        let radius = 50000; // Default 50km
        if (selectedDistance && selectedDistance !== null) {
          const distanceMatch = selectedDistance.match(/(\d+)/);
          if (distanceMatch && distanceMatch[1]) {
            const kmValue = parseInt(distanceMatch[1], 10);
            if (!isNaN(kmValue) && kmValue > 0) {
              radius = kmValue * 1000; // Convert km to meters
            }
          }
        }
        
        fetchedVendors = await fetchNearbyVendors(latitude, longitude, {
          searchQuery,
          category: selectedCategory,
          radius,
        });
      }

      const filtered = fetchedVendors.filter(v => 
        v.status === 'approved' || v.status === undefined
      );

      setVendors(filtered);
    } catch (error: any) {
      console.error('❌ [ExploreScreen] Error loading vendors:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        code: error.code,
        stack: error.stack,
      });
      
      // Don't set mock vendors - let the empty state show
      setVendors([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDistance, selectedCategory, searchQuery]);

  // Load vendors on mount and when filters change
  useEffect(() => {
    loadVendors();
  }, [loadVendors]);

  const handleVendorPress = (vendor: Vendor) => {
    router.push(`/vendors/${vendor._id}`);
  };

  const handleMapLongPress = (coordinate: { latitude: number; longitude: number }) => {
    router.push(`/vendors/add?lat=${coordinate.latitude}&lng=${coordinate.longitude}`);
  };

  // Only filter if there's an active search or category filter
  // Otherwise, show all vendors from API
  const filteredVendors = (searchQuery?.trim() || selectedCategory) 
    ? filterVendors(vendors, {
        searchQuery,
        category: selectedCategory,
      })
    : vendors;


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

