import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { authAPI } from '../../../../services/api';
import api from '../../../../services/api';

export function ConnectivityTest() {
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    console.log('🧪 [ConnectivityTest] Starting connectivity test...');
    
    try {
      // Test health endpoint
      console.log('🧪 [ConnectivityTest] Testing /api/health endpoint...');
      const healthResponse = await api.get('/health');
      console.log('✅ [ConnectivityTest] Health check passed:', healthResponse.data);
      
      Alert.alert(
        'Connection Test',
        `✅ Server is reachable!\n\nStatus: ${healthResponse.data.status}\nMessage: ${healthResponse.data.message}`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.log('❌ [ConnectivityTest] Health check failed');
      console.log('❌ [ConnectivityTest] Error:', error.message);
      console.log('❌ [ConnectivityTest] Error code:', error.code);
      console.log('❌ [ConnectivityTest] Response status:', error.response?.status);
      
      let errorMsg = 'Cannot connect to server.';
      if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network')) {
        errorMsg = 'Network error. Check:\n1. Backend is running on port 5005\n2. ADB port forwarding is set up\n3. Phone and computer are connected';
      } else if (error.code === 'ECONNREFUSED') {
        errorMsg = 'Connection refused. Backend server may not be running on port 5005.';
      }
      
      Alert.alert('Connection Test Failed', errorMsg, [{ text: 'OK' }]);
    } finally {
      setTesting(false);
    }
  };

  return (
    <TouchableOpacity
      className="mt-4 p-3 bg-gray-100 rounded-lg border border-gray-300"
      onPress={testConnection}
      disabled={testing}
    >
      <Text className="text-sm text-gray-700 text-center">
        {testing ? 'Testing connection...' : '🧪 Test Server Connection'}
      </Text>
    </TouchableOpacity>
  );
}

