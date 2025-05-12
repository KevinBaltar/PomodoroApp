// frontend/src/services/api.js
// Certifique-se de instalar o axios: npm install axios ou yarn add axios

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Para buscar o token

// Configure a baseURL da sua API backend.
// Se estiver usando emulador Android e backend local: "http://10.0.2.2:PORTA_DO_SEU_BACKEND/api"
// Se estiver usando dispositivo físico na mesma rede: "http://SEU_IP_LOCAL_NA_REDE:PORTA_DO_SEU_BACKEND/api"
// Se o backend estiver deployado: "https://SEU_DOMINIO_DEPLOYADO/api"
const API_BASE_URL = "http://10.0.2.2:3000/api"; // Exemplo para emulador Android e backend na porta 3000

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token JWT a cada requisição
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Funções da API ---

// Autenticação
export const loginUser = (credentials) => apiClient.post("/auth/login", credentials);
export const registerUser = (userData) => apiClient.post("/auth/register", userData);
export const getLoggedInUserProfile = () => apiClient.get("/auth/me"); // Rota protegida para pegar dados do usuário logado

// Usuário (Configurações Pomodoro, etc.)
export const getUserProfileDetails = () => apiClient.get("/users/profile");
export const updateUserProfile = (profileData) => apiClient.put("/users/profile", profileData);
export const deleteUserAccount = () => apiClient.delete("/users/account");
export const getPomodoroConfig = () => apiClient.get("/users/config/pomodoro");
export const updatePomodoroConfig = (configData) => apiClient.put("/users/config/pomodoro", configData);

// Tarefas
export const createTask = (taskData) => apiClient.post("/tasks", taskData);
export const getAllTasks = (params) => apiClient.get("/tasks", { params }); // params para filtros, paginação, etc.
export const getTaskById = (taskId) => apiClient.get(`/tasks/${taskId}`);
export const updateTask = (taskId, taskData) => apiClient.put(`/tasks/${taskId}`, taskData);
export const deleteTask = (taskId) => apiClient.delete(`/tasks/${taskId}`);

// Sessões Pomodoro
export const startPomodoroSession = (sessionData) => apiClient.post("/sessions/start", sessionData);
export const completePomodoroSession = (sessionId, completionData) => apiClient.post(`/sessions/${sessionId}/complete`, completionData);
export const pausePomodoroSession = (sessionId) => apiClient.post(`/sessions/${sessionId}/pause`); // Exemplo, pode ser diferente
export const resumePomodoroSession = (sessionId) => apiClient.post(`/sessions/${sessionId}/resume`); // Exemplo
export const getUserSessions = (params) => apiClient.get("/sessions", { params });
export const getSessionById = (sessionId) => apiClient.get(`/sessions/${sessionId}`);

// Adicione mais funções conforme necessário para outros endpoints da sua API

export default apiClient;

