import React from 'react';
import { Text, TextProps } from 'react-native';
import { clsx } from 'clsx';

export interface LabelProps extends TextProps {
  children: React.ReactNode;
  required?: boolean;
  variant?: 'default' | 'dark';
  className?: string;
}

export function Label({
  children,
  required = false,
  variant = 'default',
  className,
  ...props
}: LabelProps) {
  const isDark = variant === 'dark';
  
  return (
    <Text
      className={clsx(
        'text-sm font-medium mb-2',
        isDark ? 'text-gray-300' : 'text-gray-700',
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <Text className={clsx(isDark ? 'text-red-400' : 'text-red-500')}> *</Text>
      )}
    </Text>
  );
}

