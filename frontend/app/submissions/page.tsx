import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SubmissionsHeader } from './components/SubmissionsHeader';
import { SubmissionCard } from './components/SubmissionCard';
import { fetchUserSubmissions, sortSubmissionsByDate } from './utils';
import { Submission } from './types';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('📱 [Page] Submissions page initialized');
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const data = await fetchUserSubmissions();
      setSubmissions(sortSubmissionsByDate(data));
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSubmission = ({ item }: { item: Submission }) => (
    <SubmissionCard submission={item} />
  );

  return (
    <View className="flex-1 bg-gray-50">
      <SubmissionsHeader />
      {loading ? (
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-lg text-gray-600">Loading...</Text>
        </View>
      ) : submissions.length === 0 ? (
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-lg text-gray-600 mb-5">No submissions yet</Text>
        </View>
      ) : (
        <FlatList
          data={submissions}
          renderItem={renderSubmission}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 15 }}
        />
      )}
    </View>
  );
}

