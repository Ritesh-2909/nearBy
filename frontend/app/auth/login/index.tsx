import React, { useState, useEffect } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { LoginForm } from './_components/LoginForm';
import { AuthHeader } from './_components/AuthHeader';
import { AuthLink } from './_components/AuthLink';
import { ConnectivityTest } from './_components/ConnectivityTest';
import { loginUser } from './utils';
import { storage } from '../../../services/storage';
import { useAuth } from '../../../src/providers/auth-provider';

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('📱 [LoginPage] Page initialized');
    console.log('🔐 [LoginPage] Auth state - isAuthenticated:', isAuthenticated);
    // If already authenticated, redirect to tabs
    if (isAuthenticated) {
      console.log('✅ [LoginPage] User already authenticated, redirecting to tabs');
      router.replace('/(tabs)');
    } else {
      console.log('❌ [LoginPage] User not authenticated, showing login form');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async () => {
    console.log('🚀 [LoginPage] Login process started');
    console.log('📧 [LoginPage] Email:', email);
    console.log('🔑 [LoginPage] Password length:', password.length);
    
    setLoading(true);
    console.log('⏳ [LoginPage] Loading state set to true');
    
    console.log('📡 [LoginPage] Calling loginUser API...');
    const result = await loginUser({ email, password });
    
    console.log('📥 [LoginPage] Login API response received');
    console.log('✅ [LoginPage] Success:', result.success);
    
    setLoading(false);
    console.log('⏳ [LoginPage] Loading state set to false');

    if (result.success && result.data) {
      console.log('✅ [LoginPage] Login successful!');
      console.log('💾 [LoginPage] Saving token to storage...');
      await storage.setToken(result.data.token);
      console.log('✅ [LoginPage] Token saved');
      
      console.log('💾 [LoginPage] Saving user data to storage...');
      const userData = result.data.user;
      console.log('👤 [LoginPage] User data:', {
        id: userData.id || (userData as any)._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });
      await storage.setUser(userData);
      console.log('✅ [LoginPage] User data saved');
      
      console.log('🔄 [LoginPage] Refreshing auth context...');
      await refreshUser();
      console.log('✅ [LoginPage] Auth context refreshed');
      
      console.log('🧭 [LoginPage] Navigating to tabs...');
      router.replace('/(tabs)');
    } else {
      console.log('❌ [LoginPage] Login failed');
      console.log('⚠️ [LoginPage] Error:', result.error);
      Alert.alert('Login Failed', result.error || 'Please try again');
    }
  };

  return (
    <>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        className="flex-1"
        style={{ backgroundColor: '#1F2937' }} // Dark charcoal gray background
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Subtle grid pattern overlay */}
        <View 
          className="absolute inset-0"
          style={{
            backgroundColor: '#1F2937',
            opacity: 0.3,
          }}
          pointerEvents="none"
        />
        
        <View className="flex-1 justify-center p-5 relative z-10">
        <AuthHeader title="Login" subtitle="Welcome back!" />
        
        <LoginForm
          email={email}
          password={password}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
          loading={loading}
        />

        <AuthLink
          text="Don't have an account?"
          linkText="Register"
          onPress={() => router.push('/auth/register')}
        />
        
        <ConnectivityTest />
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

