// frontend/src/contexts/TasksContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar tarefas do backend
  const fetchTasks = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data.tarefas || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar tarefas:', err);
      setError('Falha ao carregar tarefas');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Carregar tarefas quando o usuário logar ou quando o contexto for montado
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Criar nova tarefa
  const createTask = async (taskData) => {
    try {
      const response = await api.post('/tasks', taskData);
      setTasks(prev => [response.data.tarefa, ...prev]);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      return { success: false, error: error.response?.data?.message || 'Erro ao criar tarefa' };
    }
  };

  // Atualizar tarefa
  const updateTask = async (taskId, updates) => {
    try {
      const response = await api.patch(`/tasks/${taskId}`, updates);
      setTasks(prev => prev.map(task => 
        task._id === taskId ? { ...task, ...response.data.tarefa } : task
      ));
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      return { success: false, error: error.response?.data?.message || 'Erro ao atualizar tarefa' };
    }
  };

  // Deletar tarefa
  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(task => task._id !== taskId));
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      return { success: false, error: error.response?.data?.message || 'Erro ao deletar tarefa' };
    }
  };

  // Alternar status de conclusão
  const toggleTaskCompletion = async (taskId) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    const newStatus = task.status === 'concluida' ? 'pendente' : 'concluida';
    return await updateTask(taskId, { status: newStatus });
  };

  // Obter tarefa por ID
  const getTaskById = (taskId) => {
    return tasks.find(task => task._id === taskId);
  };

  // Filtrar tarefas por status
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        getTaskById,
        getTasksByStatus,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => useContext(TasksContext);