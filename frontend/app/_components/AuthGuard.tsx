import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect, useRouter, useSegments } from 'expo-router';
import { useAuth } from '../../src/providers/auth-provider';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inTabsGroup = segments[0] === '(tabs)';

    if (!isAuthenticated && !inAuthGroup && segments[0] !== 'onboarding') {
      // User is not authenticated and not in auth/onboarding pages
      router.replace('/onboarding');
    } else if (isAuthenticated && (inAuthGroup || segments[0] === 'onboarding')) {
      // User is authenticated but in auth/onboarding pages
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, loading, segments]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return <>{children}</>;
}

