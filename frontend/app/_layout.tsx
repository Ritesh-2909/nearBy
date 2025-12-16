import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
// Import global CSS for NativeWind - must be imported before components
import '../global.css';

export default function RootLayout() {
  useEffect(() => {
    console.log('🚀 [App] Root Layout initialized - App is starting');
    console.log('🎨 [App] NativeWind CSS loaded');
    
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        console.log('✅ [App] App is now active and running');
      } else if (nextAppState === 'background') {
        console.log('⏸️ [App] App moved to background');
      } else if (nextAppState === 'inactive') {
        console.log('⏳ [App] App is inactive');
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Log initial state
    console.log(`📱 [App] Initial app state: ${AppState.currentState}`);

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
        }}
      >
        {/* Expo Router automatically creates screens from file structure */}
        {/* Routes:
            - / (index.tsx) -> redirects to /onboarding
            - /onboarding (onboarding/page.tsx)
            - /home (home/page.tsx)
            - /auth/login (auth/login/page.tsx)
            - /auth/register (auth/register/page.tsx)
            - /vendors/add (vendors/add/page.tsx)
            - /vendors/[id] (vendors/[id]/page.tsx)
            - /submissions (submissions/page.tsx)
        */}
      </Stack>
    </>
  );
}
