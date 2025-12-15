import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const CATEGORIES = [
  'Food & Beverages',
  'Groceries',
  'Electronics',
  'Clothing',
  'Hardware',
  'Stationery',
  'Pharmacy',
  'Other',
];

interface VendorFormProps {
  name: string;
  category: string;
  description: string;
  onNameChange: (name: string) => void;
  onCategoryChange: (category: string) => void;
  onDescriptionChange: (description: string) => void;
}

export function VendorForm({
  name,
  category,
  description,
  onNameChange,
  onCategoryChange,
  onDescriptionChange,
}: VendorFormProps) {
  const [showCategoryPicker, setShowCategoryPicker] = React.useState(false);

  return (
    <View className="p-4">
      <View className="mb-4">
        <Text className="text-base font-semibold text-gray-800 mb-2">Vendor Name *</Text>
        <TextInput
          className="border border-gray-200 rounded-lg p-3 text-base bg-gray-50"
          placeholder="Enter vendor name"
          value={name}
          onChangeText={onNameChange}
        />
      </View>

      <View className="mb-4">
        <Text className="text-base font-semibold text-gray-800 mb-2">Category *</Text>
        <TouchableOpacity
          className="flex-row justify-between items-center border border-gray-200 rounded-lg p-3 bg-gray-50"
          onPress={() => setShowCategoryPicker(!showCategoryPicker)}
        >
          <Text className="text-base text-gray-800">{category || 'Select Category'}</Text>
          <Text className="text-xs text-gray-600">▼</Text>
        </TouchableOpacity>
        {showCategoryPicker && (
          <View className="mt-2 border border-gray-200 rounded-lg bg-white">
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                className={`p-3 border-b border-gray-100 ${category === cat ? 'bg-blue-500' : ''}`}
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
        <Text className="text-base font-semibold text-gray-800 mb-2">Description (Optional)</Text>
        <TextInput
          className="border border-gray-200 rounded-lg p-3 text-base bg-gray-50 h-24"
          placeholder="Brief description"
          value={description}
          onChangeText={onDescriptionChange}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}

