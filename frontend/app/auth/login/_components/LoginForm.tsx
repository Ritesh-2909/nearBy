import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, TextInput } from 'react-native';
import { TextField, Button } from '../../../../src/components/ui';

interface LoginFormProps {
  email: string;
  password: string;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: () => void;
  loading: boolean;
  onEmailFocus?: () => void;
  onEmailBlur?: () => void;
  onPasswordFocus?: () => void;
  onPasswordBlur?: () => void;
  onPasswordVisibilityToggle?: (isVisible: boolean) => void;
  onEmailSelectionChange?: (position: number) => void;
}

export function LoginForm({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  loading,
  onEmailFocus,
  onEmailBlur,
  onPasswordFocus,
  onPasswordBlur,
  onPasswordVisibilityToggle,
  onEmailSelectionChange,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const emailInputRef = useRef<TextInput>(null);

  const handleEmailChange = (text: string) => {
    console.log('📝 [LoginForm] Email changed:', text.substring(0, 3) + '***');
    onEmailChange(text);
    // Update cursor position for eye following animation
    if (onEmailSelectionChange) {
      onEmailSelectionChange(text.length);
    }
  };

  const handlePasswordChange = (text: string) => {
    console.log('🔒 [LoginForm] Password changed, length:', text.length);
    onPasswordChange(text);
  };

  const togglePasswordVisibility = () => {
    const newVisibility = !showPassword;
    console.log('👁️ [LoginForm] Password visibility toggled:', newVisibility);
    setShowPassword(newVisibility);
    if (onPasswordVisibilityToggle) {
      onPasswordVisibilityToggle(newVisibility);
    }
  };

  const handleSubmit = () => {
    console.log('🚀 [LoginForm] Submit button pressed');
    console.log('📧 [LoginForm] Email:', email);
    console.log('🔑 [LoginForm] Password length:', password.length);
    onSubmit();
  };

  return (
    <View className="mt-6">
      <TextField
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={handleEmailChange}
        onFocus={onEmailFocus}
        onBlur={onEmailBlur}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        variant="dark"
        containerClassName="mb-4"
      />

      <TextField
        label="Password"
        placeholder="Enter your password"
        value={password}
        onChangeText={handlePasswordChange}
        onFocus={onPasswordFocus}
        onBlur={onPasswordBlur}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        variant="dark"
        containerClassName="mb-6"
        rightElement={
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text className="text-xl text-gray-400">
              {showPassword ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        }
      />

      <Button
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        variant="primary"
        size="lg"
        fullWidth
        className="mt-2"
      >
        Login
      </Button>
    </View>
  );
}


