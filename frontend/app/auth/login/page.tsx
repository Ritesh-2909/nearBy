import React, { useState, useEffect } from 'react';
import { View, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { LoginForm } from './components/LoginForm';
import { AuthHeader } from './components/AuthHeader';
import { AuthLink } from './components/AuthLink';
import { loginUser } from './utils';
import { storage } from '../../../services/storage';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('📱 [Page] Login page initialized');
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const result = await loginUser({ email, password });
    setLoading(false);

    if (result.success && result.data) {
      await storage.setToken(result.data.token);
      await storage.setUser(result.data.user);
      router.replace('/home');
    } else {
      Alert.alert('Login Failed', result.error || 'Please try again');
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View className="flex-1 justify-center p-5">
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
      </View>
    </KeyboardAvoidingView>
  );
}

