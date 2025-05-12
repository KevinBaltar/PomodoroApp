// frontend/src/contexts/AuthContext.js
import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (authData) => {
    await AsyncStorage.setItem('userToken', authData.token);
    setUser(authData.user);
    setIsAuthenticated(true);
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        await login({
          token: response.data.token,
          user: response.data.data.user
        });
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Erro no registro' 
      };
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);