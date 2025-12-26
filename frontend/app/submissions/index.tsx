import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SubmissionsHeader } from './_components/SubmissionsHeader';
import { SubmissionCard } from './_components/SubmissionCard';
import { fetchUserSubmissions, sortSubmissionsByDate } from './utils';
import { adminAPI } from '../../services/api';
import { Submission } from './types';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('📱 [Page] Moderation page initialized');
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const data = await fetchUserSubmissions();
      setSubmissions(sortSubmissionsByDate(data));
    } catch (error) {
      console.error('Error loading submissions:', error);
      // Mock data for now
      setSubmissions([
        {
          _id: '1',
          name: 'Vendor 1',
          category: 'Grocery',
          status: 'pending',
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '2',
          name: 'Vendor 2',
          category: 'Hardware',
          status: 'pending',
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '3',
          name: 'Vendor 3',
          category: 'Food',
          status: 'pending',
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: '4',
          name: 'Vendor 4',
          category: 'Service',
          status: 'pending',
          createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleApprove = async () => {
    if (selectedIds.size === 0) {
      Alert.alert('No Selection', 'Please select vendors to approve');
      return;
    }

    try {
      for (const id of selectedIds) {
        await adminAPI.approveSubmission(id);
      }
      Alert.alert('Success', `Approved ${selectedIds.size} vendor(s)`);
      setSelectedIds(new Set());
      loadSubmissions();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to approve vendors');
    }
  };

  const handleReject = async () => {
    if (selectedIds.size === 0) {
      Alert.alert('No Selection', 'Please select vendors to reject');
      return;
    }

    Alert.alert(
      'Reject Vendors',
      `Reject ${selectedIds.size} vendor(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              for (const id of selectedIds) {
                await adminAPI.rejectSubmission(id, 'Rejected by moderator');
              }
              Alert.alert('Success', `Rejected ${selectedIds.size} vendor(s)`);
              setSelectedIds(new Set());
              loadSubmissions();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.error || 'Failed to reject vendors');
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <SubmissionsHeader />
      {loading ? (
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-lg text-gray-600">Loading...</Text>
        </View>
      ) : submissions.length === 0 ? (
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-lg text-gray-600 mb-5">No pending vendors</Text>
        </View>
      ) : (
        <>
          <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {submissions.map((item) => (
                <SubmissionCard
                  key={item._id}
                  submission={item}
                  selected={selectedIds.has(item._id)}
                  onPress={() => toggleSelection(item._id)}
                />
              ))}
            </View>
          </ScrollView>
          
          {/* Action Buttons */}
          {selectedIds.size > 0 && (
            <View className="bg-white p-4 border-t border-gray-200">
              <Text className="text-sm text-gray-600 text-center mb-3">
                {selectedIds.size} vendor(s) selected
              </Text>
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  className="flex-1 bg-orange-500 p-4 rounded-lg items-center"
                  onPress={handleApprove}
                >
                  <Text className="text-white text-lg font-semibold">Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-black p-4 rounded-lg items-center"
                  onPress={handleReject}
                >
                  <Text className="text-white text-lg font-semibold">Reject</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
}

