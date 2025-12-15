import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { vendorsAPI } from '../services/api';
import { storage } from '../services/storage';

export default function VendorDetailScreen({ route }) {
  const { vendorId } = route.params;
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadVendor();
    checkFavorite();
  }, [vendorId]);

  const loadVendor = async () => {
    try {
      const response = await vendorsAPI.getById(vendorId);
      setVendor(response.data.vendor);
    } catch (error) {
      console.error('Error loading vendor:', error);
      Alert.alert('Error', 'Failed to load vendor details');
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    const favorites = await storage.getFavorites();
    setIsFavorite(favorites.includes(vendorId));
  };

  const toggleFavorite = async () => {
    if (isFavorite) {
      await storage.removeFavorite(vendorId);
    } else {
      await storage.addFavorite(vendorId);
    }
    setIsFavorite(!isFavorite);
  };

  const handleCall = () => {
    if (vendor.phone) {
      Linking.openURL(`tel:${vendor.phone}`);
    } else {
      Alert.alert('No Phone', 'Phone number not available');
    }
  };

  const handleNavigate = () => {
    if (vendor.location) {
      const { latitude, longitude } = {
        latitude: vendor.location.coordinates[1],
        longitude: vendor.location.coordinates[0],
      };
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading vendor details...</Text>
      </View>
    );
  }

  if (!vendor) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Vendor not found</Text>
      </View>
    );
  }

  const { latitude, longitude } = {
    latitude: vendor.location.coordinates[1],
    longitude: vendor.location.coordinates[0],
  };

  return (
    <ScrollView style={styles.container}>
      {vendor.photo ? (
        <Image source={{ uri: vendor.photo }} style={styles.photo} />
      ) : (
        <View style={styles.photoPlaceholder}>
          <Text style={styles.photoPlaceholderText}>No Photo</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.name}>{vendor.name}</Text>
            <Text style={styles.category}>{vendor.category}</Text>
            {vendor.status === 'pending' && (
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Pending Approval</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
            <Text style={styles.favoriteIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        </View>

        {vendor.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{vendor.description}</Text>
          </View>
        )}

        {vendor.tags && vendor.tags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {vendor.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {vendor.address && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address</Text>
            <Text style={styles.address}>{vendor.address}</Text>
          </View>
        )}

        {vendor.phone && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Phone</Text>
            <TouchableOpacity onPress={handleCall}>
              <Text style={styles.phone}>{vendor.phone}</Text>
            </TouchableOpacity>
          </View>
        )}

        {vendor.openingHours && Object.keys(vendor.openingHours).length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Opening Hours</Text>
            {Object.entries(vendor.openingHours).map(([day, hours]) => (
              <View key={day} style={styles.hoursRow}>
                <Text style={styles.day}>{day}</Text>
                <Text style={styles.hours}>{hours}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
          >
            <Marker
              coordinate={{ latitude, longitude }}
              title={vendor.name}
            />
          </MapView>
        </View>

        <View style={styles.actions}>
          {vendor.phone && (
            <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
              <Text style={styles.actionButtonText}>📞 Call</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.actionButton} onPress={handleNavigate}>
            <Text style={styles.actionButtonText}>🧭 Navigate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  photo: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  photoPlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    color: '#999',
    fontSize: 16,
  },
  content: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerText: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  category: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFA500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  favoriteButton: {
    padding: 10,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#333',
  },
  address: {
    fontSize: 16,
    color: '#666',
  },
  phone: {
    fontSize: 16,
    color: '#007AFF',
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  day: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  hours: {
    fontSize: 16,
    color: '#666',
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

