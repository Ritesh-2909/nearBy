import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '../../../../src/components/ui';

interface SubmitButtonProps {
  onPress: () => void;
  loading: boolean;
}

export function SubmitButton({ onPress, loading }: SubmitButtonProps) {
  return (
    <View className="px-4 pb-4">
      <Button
        onPress={onPress}
        loading={loading}
        disabled={loading}
        variant="primary"
        size="lg"
        fullWidth
        className="bg-gray-900 dark:bg-black"
      >
        Submit for review
      </Button>
      <Text className="text-xs text-gray-500 text-center mt-2">
        Will be visible after approval
      </Text>
    </View>
  );
}

