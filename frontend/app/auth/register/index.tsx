import React, { useState, useEffect } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { AuthHeader } from './_components/AuthHeader';
import { AuthLink } from './_components/AuthLink';
import { RegisterForm } from './_components/RegisterForm';
import { registerUser } from './utils';
import { storage } from '../../../services/storage';
import { useAuth } from '../../../src/providers/auth-provider';

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser, isAuthenticated } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('📱 [Page] Register page initialized');
    // If already authenticated, redirect to tabs
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  const handleRegister = async () => {
    setLoading(true);
    const result = await registerUser({ name, email, password });
    setLoading(false);

    if (result.success && result.data) {
      await storage.setToken(result.data.token);
      await storage.setUser(result.data.user);
      await refreshUser();
      router.replace('/(tabs)');
    } else {
      Alert.alert('Registration Failed', result.error || 'Please try again');
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
        <AuthHeader title="Register" subtitle="Create your account" />
        
        <RegisterForm
          name={name}
          email={email}
          password={password}
          onNameChange={setName}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onSubmit={handleRegister}
          loading={loading}
        />

        <AuthLink
          text="Already have an account?"
          linkText="Login"
          onPress={() => router.push('/auth/login')}
        />
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

