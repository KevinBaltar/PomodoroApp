//frontend/App.js
import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import store from './src/store'; // Assuming store is exported as default from src/store/index.js
import AppNavigator from './src/navigation/AppNavigator'; // Assuming AppNavigator is exported as default
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
