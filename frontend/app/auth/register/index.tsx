import React, { useState, useEffect } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { AuthHeader } from './components/AuthHeader';
import { AuthLink } from './components/AuthLink';
import { RegisterForm } from './components/RegisterForm';
import { registerUser } from './utils';
import { storage } from '../../../services/storage';
import { useAuth } from '../../../src/providers/auth-provider';

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('📱 [Page] Register page initialized');
  }, []);

  const handleRegister = async () => {
    setLoading(true);
    const result = await registerUser({ name, email, password });
    setLoading(false);

    if (result.success && result.data) {
      await storage.setToken(result.data.token);
      await storage.setUser(result.data.user);
      await refreshUser();
      router.replace('/home');
    } else {
      Alert.alert('Registration Failed', result.error || 'Please try again');
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 justify-center p-5">
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
  );
}

