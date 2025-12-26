import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async setToken(token: string) {
    console.log('💾 [Storage] Saving token to AsyncStorage...');
    await AsyncStorage.setItem('token', token);
    console.log('✅ [Storage] Token saved successfully');
  },
  
  async getToken() {
    console.log('🔍 [Storage] Retrieving token from AsyncStorage...');
    const token = await AsyncStorage.getItem('token');
    console.log('📥 [Storage] Token found:', !!token);
    return token;
  },
  
  async removeToken() {
    console.log('🧹 [Storage] Removing token from AsyncStorage...');
    await AsyncStorage.removeItem('token');
    console.log('✅ [Storage] Token removed');
  },
  
  async setUser(user: any) {
    console.log('💾 [Storage] Saving user data to AsyncStorage...');
    console.log('👤 [Storage] User data:', {
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    await AsyncStorage.setItem('user', JSON.stringify(user));
    console.log('✅ [Storage] User data saved successfully');
  },
  
  async getUser() {
    console.log('🔍 [Storage] Retrieving user data from AsyncStorage...');
    const user = await AsyncStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      console.log('📥 [Storage] User data found:', {
        id: parsedUser._id || parsedUser.id,
        name: parsedUser.name,
        email: parsedUser.email,
      });
      return parsedUser;
    }
    console.log('❌ [Storage] No user data found');
    return null;
  },
  
  async removeUser() {
    console.log('🧹 [Storage] Removing user data from AsyncStorage...');
    await AsyncStorage.removeItem('user');
    console.log('✅ [Storage] User data removed');
  },
  
  async setFavorites(favorites: string[]) {
    await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  },
  
  async getFavorites() {
    const favorites = await AsyncStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  },
  
  async addFavorite(vendorId: string) {
    const favorites = await this.getFavorites();
    if (!favorites.includes(vendorId)) {
      favorites.push(vendorId);
      await this.setFavorites(favorites);
    }
  },
  
  async removeFavorite(vendorId: string) {
    const favorites = await this.getFavorites();
    const updated = favorites.filter((id: string) => id !== vendorId);
    await this.setFavorites(updated);
  },
  
  async clear() {
    await AsyncStorage.clear();
  },
};



