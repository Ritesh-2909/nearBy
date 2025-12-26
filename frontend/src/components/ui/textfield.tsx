import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps, ViewStyle } from 'react-native';
import { clsx } from 'clsx';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;
  variant?: 'default' | 'dark';
  containerStyle?: ViewStyle;
}

export function TextField({
  label,
  error,
  helperText,
  containerClassName,
  inputClassName,
  labelClassName,
  errorClassName,
  rightElement,
  leftElement,
  variant = 'default',
  containerStyle,
  className,
  ...props
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const isDark = variant === 'dark';
  const baseInputClasses = clsx(
    'border-2 rounded-xl p-4 text-base',
    isDark 
      ? 'bg-black/70 border-gray-700 text-white' 
      : 'bg-white border-gray-200 text-gray-900',
    isFocused && (isDark ? 'border-blue-500' : 'border-blue-500'),
    error && 'border-red-500',
    leftElement && 'pl-12',
    rightElement && 'pr-12',
    inputClassName,
    className
  );

  const labelClasses = clsx(
    'text-sm font-medium mb-2',
    isDark ? 'text-gray-300' : 'text-gray-700',
    error && 'text-red-500',
    labelClassName
  );

  return (
    <View className={clsx('mb-4', containerClassName)} style={containerStyle}>
      {label && (
        <Text className={labelClasses}>
          {label}
        </Text>
      )}
      
      <View className="relative">
        {leftElement && (
          <View className="absolute left-4 top-0 bottom-0 justify-center z-10">
            {leftElement}
          </View>
        )}
        
        <TextInput
          className={baseInputClasses}
          placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {rightElement && (
          <View className="absolute right-4 top-0 bottom-0 justify-center z-10">
            {rightElement}
          </View>
        )}
      </View>
      
      {(error || helperText) && (
        <Text className={clsx(
          'text-xs mt-1',
          error 
            ? clsx('text-red-500', errorClassName)
            : clsx(isDark ? 'text-gray-400' : 'text-gray-500')
        )}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
}

