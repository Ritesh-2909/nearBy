import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { clsx } from 'clsx';
import { Label } from './label';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: SelectOption[];
  onValueChange: (value: string) => void;
  variant?: 'default' | 'dark';
  containerClassName?: string;
  error?: string;
  required?: boolean;
}

export function Select({
  label,
  placeholder = 'Select an option',
  value,
  options,
  onValueChange,
  variant = 'default',
  containerClassName,
  error,
  required,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = variant === 'dark';

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <View className={clsx('mb-4', containerClassName)}>
      {label && (
        <Label variant={variant} required={required} className="mb-2">
          {label}
        </Label>
      )}
      
      <TouchableOpacity
        className={clsx(
          'flex-row justify-between items-center border-2 rounded-xl p-4',
          isDark 
            ? 'bg-black/70 border-gray-700' 
            : 'bg-white border-gray-200',
          error && 'border-red-500'
        )}
        onPress={() => setIsOpen(true)}
      >
        <Text className={clsx(
          'text-base flex-1',
          selectedOption 
            ? (isDark ? 'text-white' : 'text-gray-900')
            : (isDark ? 'text-gray-400' : 'text-gray-500')
        )}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text className={clsx('text-xs ml-2', isDark ? 'text-gray-400' : 'text-gray-600')}>
          ▼
        </Text>
      </TouchableOpacity>

      {error && (
        <Text className="text-xs text-red-500 mt-1">{error}</Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className={clsx(
            'rounded-t-3xl',
            isDark ? 'bg-gray-900' : 'bg-white'
          )}>
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className={clsx(
                'text-lg font-semibold',
                isDark ? 'text-white' : 'text-gray-900'
              )}>
                {label || 'Select'}
              </Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Text className={clsx(
                  'text-lg font-semibold',
                  isDark ? 'text-blue-400' : 'text-blue-500'
                )}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView className="max-h-96">
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  className={clsx(
                    'p-4 border-b border-gray-200',
                    value === option.value && (isDark ? 'bg-blue-900/30' : 'bg-blue-50')
                  )}
                  onPress={() => {
                    onValueChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <Text className={clsx(
                    'text-base',
                    value === option.value
                      ? (isDark ? 'text-blue-400 font-semibold' : 'text-blue-600 font-semibold')
                      : (isDark ? 'text-gray-300' : 'text-gray-900')
                  )}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

