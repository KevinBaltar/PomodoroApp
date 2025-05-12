//frontend/src/screens/HomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

// Dados mocados para tarefas, substituir pela integração com a API
const mockTasks = [
  { id: '1', title: 'Desenvolver tela de Login', pomodoros: 2, completed: true },
  { id: '2', title: 'Criar componente Timer', pomodoros: 3, completed: false },
  { id: '3', title: 'Configurar navegação', pomodoros: 1, completed: false },
  { id: '4', title: 'Reunião de alinhamento', pomodoros: 1, completed: true },
];

const HomeScreen = ({ navigation }) => {
  const renderTaskItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.taskItem}
      onPress={() => console.log('Navegar para Detalhes da Tarefa:', item.id) /* navigation.navigate('TaskDetailsScreen', { taskId: item.id }) */}
    >
      <View style={styles.taskInfo}>
        <Text style={[styles.taskTitle, item.completed && styles.taskCompleted]}>{item.title}</Text>
        <Text style={styles.taskPomodoros}>{item.pomodoros} pomodoros</Text>
      </View>
      {!item.completed && (
        <TouchableOpacity 
          style={styles.playButton}
          onPress={() => console.log('Iniciar Pomodoro para:', item.title) /* navigation.navigate('TimerScreen', { taskId: item.id, taskTitle: item.title }) */}
        >
          <Text style={styles.playButtonText}>▶️</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Olá, Usuário!</Text>
        <TouchableOpacity onPress={() => console.log('Navegar para Configurações') /* navigation.navigate('SettingsScreen') */}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Minhas Tarefas de Hoje</Text>
      <FlatList
        data={mockTasks.filter(task => !task.completed)} // Mostrar apenas tarefas pendentes
        renderItem={renderTaskItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyListText}>Nenhuma tarefa pendente para hoje! 🎉</Text>}
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => console.log('Navegar para adicionar nova tarefa') /* navigation.navigate('CreateTaskScreen') */}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Atalhos rápidos ou resumo do dia poderiam ir aqui */}
      <View style={styles.quickActionsContainer}>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => console.log('Navegar para Timer Rápido') /* navigation.navigate('TimerScreen', { quickStart: true }) */}>
            <Text style={styles.quickActionButtonText}>Iniciar Foco Rápido</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton} onPress={() => console.log('Navegar para Estatísticas') /* navigation.navigate('StatsScreen') */}>
            <Text style={styles.quickActionButtonText}>Ver Estatísticas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50, // Para evitar sobreposição com a barra de status
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  settingsIcon: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ff6347',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  taskPomodoros: {
    fontSize: 12,
    color: '#777',
  },
  playButton: {
    padding: 10,
    backgroundColor: '#ff6347',
    borderRadius: 20,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 90, // Ajustado para não sobrepor os quick actions
    backgroundColor: '#ff6347',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  fabText: {
    fontSize: 30,
    color: 'white',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  quickActionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#e7e7e7',
    borderRadius: 20,
  },
  quickActionButtonText: {
    fontSize: 14,
    color: '#ff6347',
    fontWeight: '500',
  },
});

export default HomeScreen;

