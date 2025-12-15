import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { adminAPI } from '../services/api';
import { useRoute } from '@react-navigation/native';

export default function AdminModerationScreen() {
  const route = useRoute();
  const { status = 'pending' } = route.params || {};
  
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    loadSubmissions();
  }, [status]);

  const loadSubmissions = async () => {
    try {
      const response = await adminAPI.getSubmissions(status);
      setSubmissions(response.data.vendors || []);
    } catch (error) {
      console.error('Error loading submissions:', error);
      Alert.alert('Error', 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (vendorId) => {
    Alert.alert(
      'Approve Vendor',
      'Are you sure you want to approve this vendor?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              await adminAPI.approveSubmission(vendorId);
              Alert.alert('Success', 'Vendor approved');
              loadSubmissions();
            } catch (error) {
              Alert.alert('Error', 'Failed to approve vendor');
            }
          },
        },
      ]
    );
  };

  const handleReject = async () => {
    if (!selectedVendor) return;

    try {
      await adminAPI.rejectSubmission(selectedVendor._id, rejectionReason);
      Alert.alert('Success', 'Vendor rejected');
      setShowRejectModal(false);
      setSelectedVendor(null);
      setRejectionReason('');
      loadSubmissions();
    } catch (error) {
      Alert.alert('Error', 'Failed to reject vendor');
    }
  };

  const renderSubmission = ({ item }) => {
    const { latitude, longitude } = {
      latitude: item.location.coordinates[1],
      longitude: item.location.coordinates[0],
    };

    return (
      <View style={styles.submissionCard}>
        <View style={styles.submissionHeader}>
          <View style={styles.headerText}>
            <Text style={styles.vendorName}>{item.name}</Text>
            <Text style={styles.vendorCategory}>{item.category}</Text>
            {item.createdByUserId && (
              <Text style={styles.submitter}>
                Submitted by: {item.createdByUserId.name || 'User'}
              </Text>
            )}
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.status === 'approved'
                    ? '#34C759'
                    : item.status === 'rejected'
                    ? '#FF3B30'
                    : '#FFA500',
              },
            ]}
          >
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}

        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {item.address && (
          <Text style={styles.address}>📍 {item.address}</Text>
        )}

        {item.phone && (
          <Text style={styles.phone}>📞 {item.phone}</Text>
        )}

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
          >
            <Marker coordinate={{ latitude, longitude }} />
          </MapView>
        </View>

        {item.photo && (
          <Image source={{ uri: item.photo }} style={styles.photo} />
        )}

        {status === 'pending' && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.approveButton]}
              onPress={() => handleApprove(item._id)}
            >
              <Text style={styles.actionButtonText}>✅ Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.rejectButton]}
              onPress={() => {
                setSelectedVendor(item);
                setShowRejectModal(true);
              }}
            >
              <Text style={styles.actionButtonText}>❌ Reject</Text>
            </TouchableOpacity>
          </View>
        )}

        {item.rejectionReason && (
          <View style={styles.rejectionContainer}>
            <Text style={styles.rejectionLabel}>Rejection Reason:</Text>
            <Text style={styles.rejectionReason}>{item.rejectionReason}</Text>
          </View>
        )}

        <Text style={styles.date}>
          Submitted: {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {status === 'pending'
            ? 'Pending Submissions'
            : status === 'approved'
            ? 'Approved Vendors'
            : 'Rejected Vendors'}
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : submissions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No submissions found</Text>
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

      <Modal
        visible={showRejectModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRejectModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reject Vendor</Text>
            <Text style={styles.modalSubtitle}>
              Please provide a reason for rejection (optional)
            </Text>
            <TextInput
              style={styles.reasonInput}
              value={rejectionReason}
              onChangeText={setRejectionReason}
              placeholder="Rejection reason..."
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowRejectModal(false);
                  setSelectedVendor(null);
                  setRejectionReason('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmRejectButton]}
                onPress={handleReject}
              >
                <Text style={styles.modalButtonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    flex: 1,
  },
  vendorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  vendorCategory: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 4,
  },
  submitter: {
    fontSize: 12,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#333',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  mapContainer: {
    marginVertical: 10,
  },
  map: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: 'cover',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: '#34C759',
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  rejectionContainer: {
    marginTop: 10,
    padding: 10,
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
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  confirmRejectButton: {
    backgroundColor: '#FF3B30',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

