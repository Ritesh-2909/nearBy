import React from 'react';
import { View, Text } from 'react-native';
import { SimpleHeader } from './_components/SimpleHeader';
import { CenteredSearchBar } from './_components/CenteredSearchBar';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <View className="flex-1 bg-white">
      <SimpleHeader />
      <CenteredSearchBar value={searchQuery} onChangeText={setSearchQuery} />
    </View>
  );
}

