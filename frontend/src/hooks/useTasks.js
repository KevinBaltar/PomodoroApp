//frontend/src/hooks/useTasks.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Or your preferred storage solution

const TASKS_STORAGE_KEY = '@pomodoroApp_tasks';

const useTasks = (initialTasks = []) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks from storage on initial mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
        if (storedTasks !== null) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Failed to load tasks from storage', error);
        // Handle error (e.g., set to default or show a message)
      } finally {
        setIsLoading(false);
      }
    };
    loadTasks();
  }, []);

  // Save tasks to storage whenever they change
  useEffect(() => {
    const saveTasks = async () => {
      if (!isLoading) { // Avoid saving during initial load
        try {
          await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
        } catch (error) {
          console.error('Failed to save tasks to storage', error);
          // Handle error
        }
      }
    };
    saveTasks();
  }, [tasks, isLoading]);

  const addTask = (title, description = '') => {
    const newTask = {
      id: Date.now().toString(), // Simple unique ID
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const toggleTaskComplete = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const updateTask = (taskId, updates) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const getTaskById = (taskId) => {
    return tasks.find(task => task.id === taskId);
  };

  return {
    tasks,
    isLoading,
    addTask,
    toggleTaskComplete,
    deleteTask,
    updateTask,
    getTaskById,
    setTasks, // Exposing setTasks for more complex scenarios if needed (e.g., reordering)
  };
};

export default useTasks;
