import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { AddVendorHeader } from './components/AddVendorHeader';
import { VendorForm } from './components/VendorForm';
import { SubmitButton } from './components/SubmitButton';
import { submitVendor } from './utils';
import { VendorFormData } from './types';

export default function AddVendorPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('📱 [Page] Add Vendor page initialized');
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    
    // TODO: Get location from map component
    const vendorData: VendorFormData = {
      name,
      category,
      description,
      location: {
        latitude: 0, // Should come from map
        longitude: 0, // Should come from map
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
          onNameChange={setName}
          onCategoryChange={setCategory}
          onDescriptionChange={setDescription}
        />
        <SubmitButton onPress={handleSubmit} loading={loading} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

