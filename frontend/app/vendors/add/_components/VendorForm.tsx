import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { TextField, Select, SelectOption, Button } from '../../../../src/components/ui';

const CATEGORIES: SelectOption[] = [
  { label: 'Grocery', value: 'Grocery' },
  { label: 'Hardware', value: 'Hardware' },
  { label: 'Food', value: 'Food' },
  { label: 'Service', value: 'Service' },
];

interface VendorFormProps {
  name: string;
  category: string;
  description: string;
  tags: string;
  location: { latitude: number; longitude: number } | null;
  onNameChange: (name: string) => void;
  onCategoryChange: (category: string) => void;
  onDescriptionChange: (description: string) => void;
  onTagsChange: (tags: string) => void;
  onLocationChange: (location: { latitude: number; longitude: number }) => void;
}

export function VendorForm({
  name,
  category,
  description,
  tags,
  location,
  onNameChange,
  onCategoryChange,
  onDescriptionChange,
  onTagsChange,
  onLocationChange,
}: VendorFormProps) {
  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    onLocationChange({ latitude, longitude });
  };

  return (
    <View className="p-4">
      {/* Map with draggable pin */}
      {location ? (
        <View className="mb-4 h-48 rounded-lg overflow-hidden border border-gray-200">
          <MapView
            style={{ flex: 1 }}
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
              onDragEnd={(e) => {
                const { latitude, longitude } = e.nativeEvent.coordinate;
                onLocationChange({ latitude, longitude });
              }}
            />
          </MapView>
        </View>
      ) : (
        <View className="mb-4 h-48 bg-gray-100 rounded-lg items-center justify-center border border-gray-200">
          <Text className="text-4xl mb-2">📍</Text>
          <Text className="text-sm text-gray-500">Loading location...</Text>
        </View>
      )}

      <TextField
        label="Vendor Name"
        placeholder="Enter vendor name"
        value={name}
        onChangeText={onNameChange}
        variant="default"
        containerClassName="mb-4"
      />

      <Select
        label="Category"
        placeholder="Select category"
        value={category}
        options={CATEGORIES}
        onValueChange={onCategoryChange}
        variant="default"
        containerClassName="mb-4"
      />

      <TextField
        label="Tags"
        placeholder="Enter tags (comma separated)"
        value={tags}
        onChangeText={onTagsChange}
        variant="default"
        containerClassName="mb-4"
        helperText="Separate multiple tags with commas"
      />

      <TextField
        label="Description"
        placeholder="Enter vendor description"
        value={description}
        onChangeText={onDescriptionChange}
        multiline
        numberOfLines={4}
        variant="default"
        containerClassName="mb-4"
        rightElement={<Text className="text-xl">🥕</Text>}
      />

      <View className="mb-4">
        <Button
          variant="outline"
          size="md"
          fullWidth
          onPress={() => {
            // TODO: Implement photo upload
            console.log('Upload photo pressed');
          }}
        >
          📷 Upload Photo
        </Button>
      </View>
    </View>
  );
}

