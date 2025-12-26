import React, { useState, useEffect } from 'react';
import { View, Alert, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/providers/auth-provider';
import { OnboardingHeader } from './_components/OnboardingHeader';
import { FeatureList } from './_components/FeatureList';
import { ActionButtons } from './_components/ActionButtons';
import { requestLocationPermission } from './utils';

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('📱 [Page] Onboarding page initialized');
    // If user is already authenticated, redirect to tabs
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  const handleGetStarted = async () => {
    setLoading(true);
    const result = await requestLocationPermission();
    
    if (result.granted) {
      // Redirect to login/register instead of directly to tabs
      router.push('/auth/login');
    } else {
      Alert.alert('Permission Required', result.message || 'Location permission is required');
    }
    
    setLoading(false);
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <>
      <StatusBar style="light" />
      <View className="flex-1" style={{ backgroundColor: '#1F2937' }}>
      <OnboardingHeader />
      
      {/* Map Placeholder */}
      <View className="flex-1 justify-center items-center px-5">
        <View className="w-full h-64 bg-gray-800/50 rounded-lg items-center justify-center border border-gray-700 mb-6">
          <Text className="text-6xl mb-4">🗺️</Text>
          <Text className="text-sm text-gray-300">Map with vendor icons</Text>
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
    </>
  );
}

