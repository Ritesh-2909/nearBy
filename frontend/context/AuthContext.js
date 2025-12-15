import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';
import { storage } from '../services/storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedToken = await storage.getToken();
      const storedUser = await storage.getUser();
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        
        // Verify token is still valid
        try {
          const response = await authAPI.getMe();
          setUser(response.data.user);
        } catch (error) {
          // Token invalid, clear storage
          await storage.removeToken();
          await storage.setUser(null);
          setToken(null);
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { token: newToken, user: newUser } = response.data;
      
      await storage.setToken(newToken);
      await storage.setUser(newUser);
      
      setToken(newToken);
      setUser(newUser);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (email, password, name) => {
    try {
      const response = await authAPI.register(email, password, name);
      const { token: newToken, user: newUser } = response.data;
      
      await storage.setToken(newToken);
      await storage.setUser(newUser);
      
      setToken(newToken);
      setUser(newUser);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const createAnonymous = async () => {
    try {
      const response = await authAPI.createAnonymous();
      const { token: newToken } = response.data;
      
      await storage.setToken(newToken);
      
      setToken(newToken);
      setUser({ role: 'user', anonymous: true });
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to create anonymous session' 
      };
    }
  };

  const logout = async () => {
    await storage.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        createAnonymous,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

