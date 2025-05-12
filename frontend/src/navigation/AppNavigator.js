// frontend/src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext'; // Assumindo que você tem um contexto de autenticação

// Screens
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TimerScreen from '../screens/TimerScreen';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';
import StatsScreen from '../screens/StatsScreen';
import TasksScreen from '../screens/TasksScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Componente para as tabs autenticadas
function AuthenticatedTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'TasksTab') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'StatsTab') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6347', // Cor laranja
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ title: 'Início' }} 
      />
      <Tab.Screen 
        name="TasksTab" 
        component={TasksScreen} 
        options={{ title: 'Tarefas' }} 
      />
      <Tab.Screen 
        name="StatsTab" 
        component={StatsScreen} 
        options={{ title: 'Estatísticas' }} 
      />
      <Tab.Screen 
        name="SettingsTab" 
        component={SettingsScreen} 
        options={{ title: 'Configurações' }} 
      />
    </Tab.Navigator>
  );
}

const AppNavigator = () => {
  const { isAuthenticated } = useAuth(); // Hook do seu contexto de autenticação

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <>
            {/* Telas autenticadas */}
            <Stack.Screen 
              name="Main" 
              component={AuthenticatedTabs} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Timer" 
              component={TimerScreen} 
              options={{ 
                title: 'Sessão Pomodoro',
                presentation: 'modal' 
              }} 
            />
            <Stack.Screen 
              name="TaskDetails" 
              component={TaskDetailsScreen} 
              options={{ title: 'Detalhes da Tarefa' }} 
            />
            <Stack.Screen 
              name="CreateTask" 
              component={CreateTaskScreen} 
              options={{ title: 'Nova Tarefa' }} 
            />
          </>
        ) : (
          <>
            {/* Telas de autenticação */}
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen} 
              options={{ title: 'Criar Conta' }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;