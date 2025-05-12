// frontend/src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure sua URL base (ajuste para seu IP local se estiver em desenvolvimento)
const API_BASE_URL = 'http://192.168.0.108:3000/api'; // Substitua pelo IP da sua máquina

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT às requisições
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;