import React from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface RegisterFormProps {
  name: string;
  email: string;
  password: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function RegisterForm({
  name,
  email,
  password,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  loading,
}: RegisterFormProps) {
  return (
    <View className="mt-6">
      <View className="mb-4">
        <TextInput
          className="border-2 border-gray-200 rounded-xl p-4 text-base bg-white"
          placeholder="Full Name"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={onNameChange}
          autoCapitalize="words"
          style={{ elevation: 1 }}
        />
      </View>

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
          placeholder="Password (min 6 characters)"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={onPasswordChange}
          secureTextEntry
          autoCapitalize="none"
          style={{ elevation: 1 }}
        />
      </View>

      <TouchableOpacity
        tw={`bg-primary p-4 rounded-xl items-center shadow-lg ${loading ? 'opacity-60' : ''}`}
        onPress={onSubmit}
        disabled={loading}
        style={{ elevation: 4 }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-lg font-bold">Create Account</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
