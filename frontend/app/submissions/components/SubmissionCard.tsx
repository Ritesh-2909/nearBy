import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Submission } from '../types';
import { getStatusColor, formatSubmissionDate } from '../utils';

interface SubmissionCardProps {
  submission: Submission;
}

export function SubmissionCard({ submission }: SubmissionCardProps) {
  return (
    <TouchableOpacity className="bg-white p-4 rounded-lg mb-2.5 shadow-sm">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="flex-1 text-lg font-semibold text-gray-800 mr-2.5">{submission.name}</Text>
        <View className={`px-2 py-1 rounded`} style={{ backgroundColor: getStatusColor(submission.status) }}>
          <Text className="text-white text-xs font-semibold">{submission.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text className="text-sm text-blue-500 mb-1">{submission.category}</Text>
      <Text className="text-xs text-gray-400 mt-2">
        Submitted: {formatSubmissionDate(submission.createdAt)}
      </Text>
    </TouchableOpacity>
  );
}

