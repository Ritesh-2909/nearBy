import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Submission } from '../types';


interface SubmissionCardProps {
  submission: Submission;
  selected?: boolean;
  onPress?: () => void;
}

export function SubmissionCard({ submission, selected = false, onPress }: SubmissionCardProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <TouchableOpacity
      className={`bg-white rounded-lg mb-3 shadow-sm border-2 ${
        selected ? 'border-orange-500' : 'border-gray-200'
      }`}
      style={{ width: '48%', marginBottom: 12 }}
      onPress={onPress}
    >
      {/* Map Placeholder */}
      <View className="h-24 bg-gray-100 rounded-t-lg items-center justify-center">
        <Text className="text-2xl">📍</Text>
      </View>
      
      {/* Status and Time */}
      <View className="p-2">
        <Text className="text-xs font-semibold text-gray-900 mb-1">{submission.name}</Text>
        <Text className="text-xs text-gray-600">
          {submission.status === 'pending' ? 'Submit for review' : submission.status} {formatTime(submission.createdAt)}
        </Text>
        {selected && (
          <View className="absolute top-2 right-2 w-5 h-5 bg-orange-500 rounded-full items-center justify-center">
            <Text className="text-white text-xs">✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

