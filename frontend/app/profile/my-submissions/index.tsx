import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { vendorsAPI } from '../../../services/api';

interface Submission {
  _id: string;
  name: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  description?: string;
  rejectionReason?: string;
  createdAt: string;
  moderatedAt?: string;
}

export default function MySubmissionsPage() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log('📱 [Page] My Submissions page initialized');
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const response = await vendorsAPI.getMySubmissions();
      setSubmissions(response.data.vendors || []);
    } catch (error: any) {
      console.error('Error loading submissions:', error);
      // Show empty state if error
      setSubmissions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadSubmissions();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 border-green-500';
      case 'pending':
        return 'bg-yellow-100 border-yellow-500';
      case 'rejected':
        return 'bg-red-100 border-red-500';
      default:
        return 'bg-gray-100 border-gray-500';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-700';
      case 'pending':
        return 'text-yellow-700';
      case 'rejected':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return '✅';
      case 'pending':
        return '⏳';
      case 'rejected':
        return '❌';
      default:
        return '📋';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-12 pb-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-gray-900">My Submissions</Text>
            <Text className="text-sm text-gray-600 mt-1">
              Track your vendor contributions
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
          >
            <Text className="text-xl">✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Loading...</Text>
        </View>
      ) : submissions.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-6xl mb-4">📝</Text>
          <Text className="text-xl font-semibold text-gray-900 mb-2 text-center">
            No Submissions Yet
          </Text>
          <Text className="text-sm text-gray-600 text-center mb-6">
            Start contributing by adding vendors you discover in your neighborhood
          </Text>
          <TouchableOpacity
            className="bg-orange-500 px-6 py-3 rounded-lg"
            onPress={() => router.push('/vendors/add')}
          >
            <Text className="text-white font-semibold">Add Your First Vendor</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Stats Summary */}
          <View className="flex-row mb-4 space-x-2">
            <View className="flex-1 bg-green-50 p-3 rounded-lg border border-green-200">
              <Text className="text-2xl font-bold text-green-700">
                {submissions.filter(s => s.status === 'approved').length}
              </Text>
              <Text className="text-xs text-green-600">Approved</Text>
            </View>
            <View className="flex-1 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <Text className="text-2xl font-bold text-yellow-700">
                {submissions.filter(s => s.status === 'pending').length}
              </Text>
              <Text className="text-xs text-yellow-600">Pending</Text>
            </View>
            <View className="flex-1 bg-red-50 p-3 rounded-lg border border-red-200">
              <Text className="text-2xl font-bold text-red-700">
                {submissions.filter(s => s.status === 'rejected').length}
              </Text>
              <Text className="text-xs text-red-600">Rejected</Text>
            </View>
          </View>

          {/* Submissions List */}
          {submissions.map((submission) => (
            <TouchableOpacity
              key={submission._id}
              className={`bg-white p-4 rounded-lg mb-3 border-l-4 ${getStatusColor(submission.status)}`}
              onPress={() => {
                if (submission.status === 'approved') {
                  router.push(`/vendors/${submission._id}`);
                }
              }}
            >
              <View className="flex-row items-start justify-between mb-2">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    {submission.name}
                  </Text>
                  <Text className="text-sm text-gray-600">{submission.category}</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-xl mr-1">{getStatusIcon(submission.status)}</Text>
                  <Text className={`text-xs font-semibold uppercase ${getStatusTextColor(submission.status)}`}>
                    {submission.status}
                  </Text>
                </View>
              </View>

              {submission.description && (
                <Text className="text-sm text-gray-700 mb-2" numberOfLines={2}>
                  {submission.description}
                </Text>
              )}

              {submission.status === 'rejected' && submission.rejectionReason && (
                <View className="bg-red-50 p-2 rounded mt-2">
                  <Text className="text-xs text-red-700">
                    <Text className="font-semibold">Reason: </Text>
                    {submission.rejectionReason}
                  </Text>
                </View>
              )}

              <View className="flex-row justify-between items-center mt-2">
                <Text className="text-xs text-gray-500">
                  Submitted {formatDate(submission.createdAt)}
                </Text>
                {submission.moderatedAt && (
                  <Text className="text-xs text-gray-500">
                    Reviewed {formatDate(submission.moderatedAt)}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}

          {/* Add More Button */}
          <TouchableOpacity
            className="bg-orange-500 p-4 rounded-lg items-center mt-4"
            onPress={() => router.push('/vendors/add')}
          >
            <Text className="text-white font-semibold text-base">+ Add Another Vendor</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}
