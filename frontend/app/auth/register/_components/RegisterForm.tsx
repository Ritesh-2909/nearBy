import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { TextField, Button } from '../../../../src/components/ui';

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
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View className="mt-6">
      <TextField
        label="Full Name"
        placeholder="Enter your full name"
        value={name}
        onChangeText={onNameChange}
        autoCapitalize="words"
        variant="default"
        containerClassName="mb-4"
      />

      <TextField
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={onEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        variant="default"
        containerClassName="mb-4"
      />

      <TextField
        label="Password"
        placeholder="Enter your password (min 6 characters)"
        value={password}
        onChangeText={onPasswordChange}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        variant="default"
        containerClassName="mb-6"
        helperText="Password must be at least 6 characters"
        rightElement={
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text className="text-xl text-gray-600">
              {showPassword ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        }
      />

      <Button
        onPress={onSubmit}
        loading={loading}
        disabled={loading}
        variant="primary"
        size="lg"
        fullWidth
        className="mt-2"
      >
        Create Account
      </Button>
    </View>
  );
}



