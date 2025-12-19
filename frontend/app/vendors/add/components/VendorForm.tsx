import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const CATEGORIES = [
  'Grocery',
  'Hardware',
  'Food',
  'Service',
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
  const [showCategoryPicker, setShowCategoryPicker] = React.useState(false);

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

      <View className="mb-4">
        <TextInput
          className="border border-gray-200 rounded-lg p-3 text-base bg-white"
          placeholder="Vendor name"
          value={name}
          onChangeText={onNameChange}
        />
      </View>

      <View className="mb-4">
        <TouchableOpacity
          className="flex-row justify-between items-center border border-gray-200 rounded-lg p-3 bg-white"
          onPress={() => setShowCategoryPicker(!showCategoryPicker)}
        >
          <Text className="text-base text-gray-800">{category || 'Category'}</Text>
          <Text className="text-xs text-gray-600">▼</Text>
        </TouchableOpacity>
        {showCategoryPicker && (
          <View className="mt-2 border border-gray-200 rounded-lg bg-white">
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                className={`p-3 border-b border-gray-100 ${category === cat ? 'bg-orange-500' : ''}`}
                onPress={() => {
                  onCategoryChange(cat);
                  setShowCategoryPicker(false);
                }}
              >
                <Text className={`text-base ${category === cat ? 'text-white' : 'text-gray-800'}`}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View className="mb-4">
        <TextInput
          className="border border-gray-200 rounded-lg p-3 text-base bg-white"
          placeholder="Tags"
          value={tags}
          onChangeText={onTagsChange}
        />
      </View>

      <View className="mb-4">
        <View className="flex-row items-center border border-gray-200 rounded-lg p-3 bg-white">
          <TextInput
            className="flex-1 text-base"
            placeholder="Description"
            value={description}
            onChangeText={onDescriptionChange}
            multiline
          />
          <Text className="text-xl ml-2">🥕</Text>
        </View>
      </View>

      <View className="mb-4">
        <TouchableOpacity className="border border-gray-200 rounded-lg p-3 bg-white">
          <Text className="text-base text-gray-600">Upload photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

