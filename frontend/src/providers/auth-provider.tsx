import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '../../services/storage';
import { authAPI } from '../../services/api';

type User = {
  _id: string;
  name: string;
  email: string;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    console.log('🔄 [AuthProvider] refreshUser called');
    try {
      console.log('🔍 [AuthProvider] Checking for stored token...');
      const token = await storage.getToken();
      if (!token) {
        console.log('❌ [AuthProvider] No token found in storage');
        setUser(null);
        setLoading(false);
        return;
      }
      console.log('✅ [AuthProvider] Token found in storage');

      // Validate token by calling /auth/me endpoint
      try {
        console.log('📡 [AuthProvider] Validating token with /auth/me API...');
        const startTime = Date.now();
        const response = await authAPI.getMe();
        const duration = Date.now() - startTime;
        console.log(`✅ [AuthProvider] Token validation successful (${duration}ms)`);
        
        if (response.data && response.data.user) {
          const userData = response.data.user;
          console.log('👤 [AuthProvider] User data received:', {
            id: userData.id || userData._id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
          });
          
          // Update stored user data
          console.log('💾 [AuthProvider] Updating stored user data...');
          await storage.setUser({
            _id: userData.id || userData._id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
          });
          console.log('✅ [AuthProvider] User data updated in storage');
          
          setUser({
            _id: userData.id || userData._id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
          });
          console.log('✅ [AuthProvider] User state updated in context');
          console.log('✅ [AuthProvider] User is now authenticated');
        } else {
          // Invalid response, clear auth
          console.log('❌ [AuthProvider] Invalid response from API, clearing auth');
          await storage.removeToken();
          await storage.removeUser();
          setUser(null);
          console.log('✅ [AuthProvider] Auth data cleared');
        }
      } catch (error: any) {
        // Token is invalid or expired
        console.log('❌ [AuthProvider] Token validation failed');
        console.log('⚠️ [AuthProvider] Error status:', error.response?.status);
        console.log('⚠️ [AuthProvider] Error message:', error.message);
        console.log('🧹 [AuthProvider] Clearing invalid token and user data...');
        await storage.removeToken();
        await storage.removeUser();
        setUser(null);
        console.log('✅ [AuthProvider] Auth data cleared due to invalid token');
      }
    } catch (error) {
      console.error('❌ [AuthProvider] Error in refreshUser:', error);
      setUser(null);
    } finally {
      setLoading(false);
      console.log('⏳ [AuthProvider] Loading state set to false');
    }
  };

  useEffect(() => {
    console.log('🚀 [AuthProvider] Component mounted, initializing auth state...');
    refreshUser();
  }, []);

  const login = async (email: string, pass: string) => {
    // Login is handled by the login page, this is just for context
    console.log('🔄 [AuthProvider] login method called (refresh only)');
    await refreshUser();
  };

  const register = async (email: string, pass: string) => {
    // Registration is handled by the register page, this is just for context
    console.log('🔄 [AuthProvider] register method called (refresh only)');
    await refreshUser();
  };

  const logout = async () => {
    console.log('🚪 [AuthProvider] Logout called');
    console.log('🧹 [AuthProvider] Removing token...');
    await storage.removeToken();
    console.log('✅ [AuthProvider] Token removed');
    console.log('🧹 [AuthProvider] Removing user data...');
    await storage.removeUser();
    console.log('✅ [AuthProvider] User data removed');
    setUser(null);
    console.log('✅ [AuthProvider] User state cleared');
    console.log('✅ [AuthProvider] Logout complete');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        register,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
