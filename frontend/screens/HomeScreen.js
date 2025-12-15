import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { vendorsAPI } from '../services/api';
import { CATEGORIES } from '../config';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [radius, setRadius] = useState(3000);
  const [longPressLocation, setLongPressLocation] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (location) {
      loadVendors();
    }
  }, [location, selectedCategory, radius]);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get location');
    }
  };

  const loadVendors = async () => {
    if (!location) return;

    setLoading(true);
    try {
      const response = await vendorsAPI.getNearby(
        location.latitude,
        location.longitude,
        radius,
        selectedCategory,
        searchQuery || null
      );
      setVendors(response.data.vendors || []);
    } catch (error) {
      console.error('Error loading vendors:', error);
      Alert.alert('Error', 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadVendors();
  };

  const handleLongPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLongPressLocation({ latitude, longitude });
    Alert.alert(
      'Add Vendor',
      'Add a vendor at this location?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: () => {
            navigation.navigate('AddVendor', {
              initialLocation: { latitude, longitude },
            });
            setLongPressLocation(null);
          },
        },
      ]
    );
  };

  const handleVendorPress = (vendor) => {
    vendorsAPI.incrementClick(vendor._id).catch(console.error);
    navigation.navigate('VendorDetail', { vendorId: vendor._id });
  };

  const renderVendorItem = ({ item }) => (
    <TouchableOpacity
      style={styles.vendorCard}
      onPress={() => handleVendorPress(item)}
    >
      <Text style={styles.vendorName}>{item.name}</Text>
      <Text style={styles.vendorCategory}>{item.category}</Text>
      <Text style={styles.vendorDistance}>
        {item.distance ? `${item.distance}m away` : 'Distance unknown'}
      </Text>
      {item.description && (
        <Text style={styles.vendorDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>No vendors found nearby</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddVendor', { initialLocation: location })}
      >
        <Text style={styles.addButtonText}>Add Nearby Vendor</Text>
      </TouchableOpacity>
    </View>
  );

  if (!location) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search vendors..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          data={[null, ...CATEGORIES]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item && styles.categoryChipSelected,
              ]}
              onPress={() => setSelectedCategory(item)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === item && styles.categoryChipTextSelected,
                ]}
              >
                {item || 'All'}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* View Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]}
          onPress={() => setViewMode('map')}
        >
          <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>
            Map
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'list' && styles.toggleButtonActive]}
          onPress={() => setViewMode('list')}
        >
          <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>
            List
          </Text>
        </TouchableOpacity>
      </View>

      {/* Map or List View */}
      {viewMode === 'map' ? (
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          onLongPress={handleLongPress}
        >
          <Marker
            coordinate={location}
            title="Your Location"
            pinColor="blue"
          />
          {vendors.map((vendor) => (
            <Marker
              key={vendor._id}
              coordinate={{
                latitude: vendor.location.coordinates[1],
                longitude: vendor.location.coordinates[0],
              }}
              title={vendor.name}
              description={vendor.category}
              onPress={() => handleVendorPress(vendor)}
            />
          ))}
        </MapView>
      ) : (
        <FlatList
          data={vendors}
          renderItem={renderVendorItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={!loading ? renderEmptyState : null}
          refreshing={loading}
          onRefresh={loadVendors}
        />
      )}

      {/* Add Vendor Button (shown when list is empty or at bottom) */}
      {vendors.length === 0 && !loading && viewMode === 'list' && (
        <View style={styles.bottomAddButton}>
          <TouchableOpacity
            style={styles.addVendorButton}
            onPress={() => navigation.navigate('AddVendor', { initialLocation: location })}
          >
            <Text style={styles.addVendorButtonText}>+ Add Nearby Vendor</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        {user?.role === 'admin' && (
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('AdminDashboard')}
          >
            <Text style={styles.fabText}>⚙️</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('MySubmissions')}
        >
          <Text style={styles.fabText}>📋</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  searchButtonText: {
    fontSize: 20,
  },
  categoryContainer: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 5,
  },
  categoryChipSelected: {
    backgroundColor: '#007AFF',
  },
  categoryChipText: {
    color: '#333',
    fontSize: 14,
  },
  categoryChipTextSelected: {
    color: '#fff',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  toggleButtonActive: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    color: '#666',
    fontSize: 16,
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  map: {
    flex: 1,
  },
  listContainer: {
    padding: 10,
  },
  vendorCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  vendorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  vendorCategory: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 4,
  },
  vendorDistance: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  vendorDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomAddButton: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  addVendorButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addVendorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  fab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 20,
  },
});

