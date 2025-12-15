import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import VendorDetailScreen from '../screens/VendorDetailScreen';
import AddVendorScreen from '../screens/AddVendorScreen';
import MySubmissionsScreen from '../screens/MySubmissionsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminModerationScreen from '../screens/AdminModerationScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="VendorDetail" component={VendorDetailScreen} />
          <Stack.Screen name="AddVendor" component={AddVendorScreen} />
          <Stack.Screen name="MySubmissions" component={MySubmissionsScreen} />
          {user.role === 'admin' && (
            <>
              <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
              <Stack.Screen name="AdminModeration" component={AdminModerationScreen} />
            </>
          )}
        </>
      )}
    </Stack.Navigator>
  );
}

