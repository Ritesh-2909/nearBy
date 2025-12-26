import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { clsx } from 'clsx';

export interface ButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  activeOpacity?: number;
  className?: string;
  fullWidth?: boolean;
}

export function Button({
  onPress,
  disabled,
  loading = false,
  variant = 'primary',
  size = 'lg',
  style,
  textStyle,
  icon,
  rightIcon,
  children,
  activeOpacity = 0.7,
  className,
  fullWidth = false,
}: ButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2',
    md: 'px-5 py-3',
    lg: 'px-6 py-4',
  };

  const variantClasses = {
    primary: 'bg-blue-500 dark:bg-blue-600',
    secondary: 'bg-gray-200 dark:bg-gray-700',
    outline: 'bg-transparent border-2 border-gray-300 dark:border-gray-600',
    ghost: 'bg-transparent',
    destructive: 'bg-red-500 dark:bg-red-600',
  };

  const variantTextClasses = {
    primary: 'text-white dark:text-white',
    secondary: 'text-gray-900 dark:text-gray-100',
    outline: 'text-gray-900 dark:text-gray-100',
    ghost: 'text-gray-900 dark:text-gray-100',
    destructive: 'text-white dark:text-white',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const iconSpacing = {
    sm: 'gap-1.5',
    md: 'gap-2',
    lg: 'gap-2.5',
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      className={clsx(
        'rounded-xl items-center justify-center',
        sizeClasses[size],
        variantClasses[variant],
        isDisabled && 'opacity-60',
        fullWidth && 'w-full',
        className
      )}
      style={style}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={activeOpacity}
    >
      <View className={clsx('flex-row items-center justify-center', iconSpacing[size])}>
        {loading ? (
          <ActivityIndicator 
            color={variant === 'primary' || variant === 'destructive' ? '#FFFFFF' : '#374151'} 
            size="small"
          />
        ) : (
          <>
            {icon && icon}
            {typeof children === 'string' ? (
              <Text 
                className={clsx(
                  'font-bold',
                  textSizeClasses[size],
                  variantTextClasses[variant]
                )} 
                style={textStyle}
              >
                {children}
              </Text>
            ) : (
              children
            )}
            {rightIcon && rightIcon}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

