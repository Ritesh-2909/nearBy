import React, { useState, useEffect } from 'react';
import { View, Alert, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { OnboardingHeader } from './components/OnboardingHeader';
import { FeatureList } from './components/FeatureList';
import { ActionButtons } from './components/ActionButtons';
import { requestLocationPermission } from './utils';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('📱 [Page] Onboarding page initialized');
  }, []);

  const handleGetStarted = async () => {
    setLoading(true);
    const result = await requestLocationPermission();
    
    if (result.granted) {
      router.replace('/home');
    } else {
      Alert.alert('Permission Required', result.message || 'Location permission is required');
    }
    
    setLoading(false);
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <View className="flex-1 bg-white">
      <OnboardingHeader />
      
      {/* Map Placeholder */}
      <View className="flex-1 justify-center items-center px-5">
        <View className="w-full h-64 bg-gray-100 rounded-lg items-center justify-center border border-gray-200 mb-6">
          <Text className="text-6xl mb-4">🗺️</Text>
          <Text className="text-sm text-gray-500">Map with vendor icons</Text>
        </View>
      </View>
      
      <View className="px-5 pb-8">
        <ActionButtons 
          onGetStarted={handleGetStarted}
          onLogin={handleLogin}
          loading={loading}
        />
      </View>
    </View>
  );
}

