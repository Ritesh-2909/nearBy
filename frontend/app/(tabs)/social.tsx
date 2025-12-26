import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ComingSoonIllustration } from './_components/ComingSoonIllustration';

export default function SocialScreen() {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-5 py-20">
        <ComingSoonIllustration />
        <Text className="text-2xl font-bold text-gray-900 mt-8 mb-3">
          Coming Soon
        </Text>
        <Text className="text-base text-gray-600 text-center max-w-sm">
          Connect with other users, share your favorite vendors, and discover new places together.
        </Text>
        <View className="mt-8 bg-gray-50 rounded-xl p-5 max-w-sm">
          <Text className="text-sm text-gray-700 text-center">
            🎉 Social features are under development. Stay tuned for updates!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

