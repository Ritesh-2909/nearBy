import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import { AddVendorHeader } from './components/AddVendorHeader';
import { VendorForm } from './components/VendorForm';
import { SubmitButton } from './components/SubmitButton';
import { submitVendor } from './utils';
import { VendorFormData } from './types';

export default function AddVendorPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('📱 [Page] Add Vendor page initialized');
    
    const initializeLocation = async () => {
      // Check if location came from map long-press (from query params or route params)
      const latParam = (params.lat as string) || (params as any).lat;
      const lngParam = (params.lng as string) || (params as any).lng;
      
      if (latParam && lngParam) {
        setLocation({
          latitude: parseFloat(latParam),
          longitude: parseFloat(lngParam),
        });
        return;
      }

      // Otherwise get current location
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Location permission is needed to add a vendor');
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
      } catch (error) {
        console.error('Error getting location:', error);
        Alert.alert('Error', 'Could not get your location. Please try again.');
      }
    };

    initializeLocation();
  }, [params]);

  const handleSubmit = async () => {
    if (!location) {
      Alert.alert('Location Required', 'Please set the vendor location');
      return;
    }

    setLoading(true);
    
    const vendorData: VendorFormData = {
      name,
      category,
      description,
      tags: tags.split(',').map(t => t.trim()).filter(t => t.length > 0),
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
    };

    const result = await submitVendor(vendorData);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Success',
        result.data?.message || 'Vendor submitted successfully. It will go live after review.'
      );
      router.back();
    } else {
      Alert.alert('Error', result.error || 'Failed to submit vendor');
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1">
        <AddVendorHeader />
        <VendorForm
          name={name}
          category={category}
          description={description}
          tags={tags}
          location={location}
          onNameChange={setName}
          onCategoryChange={setCategory}
          onDescriptionChange={setDescription}
          onTagsChange={setTags}
          onLocationChange={setLocation}
        />
        <SubmitButton onPress={handleSubmit} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

