import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
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
    <View className="flex-1 bg-blue-50">
      <View className="flex-1 justify-center">
        <OnboardingHeader />
        <FeatureList />
      </View>
      <ActionButtons 
        onGetStarted={handleGetStarted}
        onLogin={handleLogin}
        loading={loading}
      />
    </View>
  );
}

