import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { vendorsAPI } from '../services/api';

export default function MySubmissionsScreen() {
  const navigation = useNavigation();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      const response = await vendorsAPI.getMySubmissions();
      setSubmissions(response.data.vendors || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#34C759';
      case 'pending':
        return '#FFA500';
      case 'rejected':
        return '#FF3B30';
      default:
        return '#666';
    }
  };

  const renderSubmission = ({ item }) => (
    <TouchableOpacity
      style={styles.submissionCard}
      onPress={() => navigation.navigate('VendorDetail', { vendorId: item._id })}
    >
      <View style={styles.submissionHeader}>
        <Text style={styles.submissionName}>{item.name}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.submissionCategory}>{item.category}</Text>
      {item.description && (
        <Text style={styles.submissionDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      <Text style={styles.submissionDate}>
        Submitted: {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      {item.status === 'rejected' && item.rejectionReason && (
        <View style={styles.rejectionContainer}>
          <Text style={styles.rejectionLabel}>Rejection Reason:</Text>
          <Text style={styles.rejectionReason}>{item.rejectionReason}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading submissions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Submissions</Text>
      </View>

      {submissions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No submissions yet</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.addButtonText}>Add Your First Vendor</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={submissions}
          renderItem={renderSubmission}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={loadSubmissions} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 15,
  },
  submissionCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  submissionName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  submissionCategory: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 4,
  },
  submissionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  submissionDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  rejectionContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FFE5E5',
    borderRadius: 4,
  },
  rejectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF3B30',
    marginBottom: 4,
  },
  rejectionReason: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

