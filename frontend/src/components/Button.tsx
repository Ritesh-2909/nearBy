import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle, TextStyle } from 'react-native';
import { clsx } from 'clsx';

interface ButtonProps {
  onPress?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'noBg';
  size?: 'small' | 'large';
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
  activeOpacity?: number;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  disabled,
  variant = 'primary',
  size = 'large',
  style,
  textStyle,
  icon,
  rightIcon,
  children,
  activeOpacity = 0.9,
  className,
}) => {
  const sizeClasses = {
    small: 'px-2.5 py-1',
    large: 'px-2.5 py-2',
  };

  const variantClasses = {
    primary: 'bg-primary-default dark:bg-primary-default-dark rounded-2.5xl',
    secondary: 'bg-primary-default dark:bg-primary-default-dark rounded-2.5xl',
    tertiary: 'bg-transparent border rounded-xl',
    outline: 'bg-transparent border border-gray-300',
    noBg: 'bg-transparent',
  };

  const variantTextClasses = {
    primary: 'text-white font-bold text-sm',
    secondary: 'text-white font-semibold text-sm',
    tertiary: 'text-primary-default dark:text-white',
    outline: 'text-gray-300',
    noBg: 'text-primary-default',
  };

  const iconSpacing = {
    small: 'gap-1',
    large: 'gap-2',
  };

  return (
    <TouchableOpacity
      className={clsx(
        sizeClasses[size],
        variantClasses[variant],
        disabled && 'opacity-50',
        className
      )}
      style={style}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={activeOpacity}
    >
      <View className={clsx('flex-row items-center justify-center', iconSpacing[size])}>
        {icon && icon}

        {typeof children === 'string' ? (
          <Text className={clsx(variantTextClasses[variant])} style={textStyle}>
            {children}
          </Text>
        ) : (
          children
        )}

        {rightIcon && rightIcon}
      </View>
    </TouchableOpacity>
  );
};

export default Button;
