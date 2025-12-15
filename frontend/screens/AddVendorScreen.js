import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { vendorsAPI } from '../services/api';
import { CATEGORIES } from '../config';
import { useNavigation } from '@react-navigation/native';

export default function AddVendorScreen({ route }) {
  const navigation = useNavigation();
  const { initialLocation } = route.params || {};
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [photo, setPhoto] = useState('');
  const [location, setLocation] = useState(initialLocation || null);
  const [loading, setLoading] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  useEffect(() => {
    if (!initialLocation) {
      getCurrentLocation();
    }
  }, []);

  const getCurrentLocation = async () => {
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
    }
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera roll permission is required');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Vendor name is required');
      return;
    }

    if (!category) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Please set the vendor location on the map');
      return;
    }

    setLoading(true);
    try {
      const tagArray = tags.split(',').map(t => t.trim()).filter(t => t);
      
      const vendorData = {
        name: name.trim(),
        category,
        description: description.trim(),
        tags: tagArray,
        address: address.trim(),
        phone: phone.trim(),
        photo,
        location: {
          lat: location.latitude,
          lng: location.longitude,
        },
      };

      const response = await vendorsAPI.submitVendor(vendorData);

      if (response.data.duplicate) {
        Alert.alert(
          'Duplicate Vendor',
          'A vendor with a similar name already exists nearby. Would you like to submit anyway?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Submit Anyway',
              onPress: async () => {
                // Submit anyway - you might want to handle this differently
                Alert.alert('Success', 'Vendor submitted successfully. It will go live after review.');
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Success',
          'Vendor submitted successfully. It will go live after review.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('Error submitting vendor:', error);
      const errorMessage = error.response?.data?.error || 'Failed to submit vendor';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!location) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Getting location...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Vendor</Text>
          <Text style={styles.subtitle}>This will go live after review</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Vendor Name *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter vendor name"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Category *</Text>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          >
            <Text style={styles.categoryButtonText}>
              {category || 'Select Category'}
            </Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </TouchableOpacity>
          {showCategoryPicker && (
            <View style={styles.categoryPicker}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryOption,
                    category === cat && styles.categoryOptionSelected,
                  ]}
                  onPress={() => {
                    setCategory(cat);
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryOptionText,
                      category === cat && styles.categoryOptionTextSelected,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Brief description"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Tags (Optional, comma-separated)</Text>
          <TextInput
            style={styles.input}
            value={tags}
            onChangeText={setTags}
            placeholder="e.g., fresh, organic, cheap"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Address (Optional)</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Street address"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Phone (Optional)</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Photo (Optional)</Text>
          <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
            <Text style={styles.photoButtonText}>
              {photo ? 'Change Photo' : 'Pick Photo'}
            </Text>
          </TouchableOpacity>
          {photo && <Text style={styles.photoPath}>{photo}</Text>}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Location *</Text>
          <Text style={styles.helpText}>
            Drag the pin to adjust the vendor location
          </Text>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={handleMapPress}
          >
            <Marker
              coordinate={location}
              draggable
              onDragEnd={(e) => setLocation(e.nativeEvent.coordinate)}
            />
          </MapView>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Vendor</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  categoryPicker: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    maxHeight: 200,
  },
  categoryOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryOptionSelected: {
    backgroundColor: '#007AFF',
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#333',
  },
  categoryOptionTextSelected: {
    color: '#fff',
  },
  photoButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  photoButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  photoPath: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    margin: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

