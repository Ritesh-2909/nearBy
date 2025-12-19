import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function LoginForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  loading,
}: LoginFormProps) {
  return (
    <View className="mt-6">
      <View className="mb-4">
        <TextInput
          className="border-2 border-gray-200 rounded-xl p-4 text-base bg-white"
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={onEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          style={{ elevation: 1 }}
        />
      </View>

      <View className="mb-6">
        <TextInput
          className="border-2 border-gray-200 rounded-xl p-4 text-base bg-white"
          placeholder="Password"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={onPasswordChange}
          secureTextEntry
          autoCapitalize="none"
          style={{ elevation: 1 }}
        />
      </View>

      <TouchableOpacity
        className={`bg-blue-500 p-4 rounded-xl items-center ${loading ? 'opacity-60' : ''}`}
        onPress={onSubmit}
        disabled={loading}
        style={{ elevation: 4 }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-lg font-bold">Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}


