import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { HomeHeader } from './components/HomeHeader';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { VendorList } from './components/VendorList';
import { FloatingActions } from './components/FloatingActions';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  useEffect(() => {
    console.log('📱 [Page] Home page initialized');
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      <HomeHeader />
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      <VendorList 
        searchQuery={searchQuery}
        category={selectedCategory}
      />
      <FloatingActions router={router} />
    </View>
  );
}

