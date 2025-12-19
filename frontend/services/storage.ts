import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async setToken(token: string) {
    await AsyncStorage.setItem('token', token);
  },
  
  async getToken() {
    return await AsyncStorage.getItem('token');
  },
  
  async removeToken() {
    await AsyncStorage.removeItem('token');
  },
  
  async setUser(user: any) {
    await AsyncStorage.setItem('user', JSON.stringify(user));
  },
  
  async getUser() {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
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



