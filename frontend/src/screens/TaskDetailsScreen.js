//frontend/src/screens/TaskDetailsScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

// Mock de dados da tarefa, idealmente viria da API ou navegação
const mockTask = {
  id: '2',
  title: 'Criar componente Timer',
  description: 'Desenvolver o componente principal do timer com funcionalidades de iniciar, pausar, resetar e pular para o próximo ciclo. Incluir feedback visual e sonoro.',
  pomodoros_estimados: 3,
  pomodoros_realizados: 1,
  status: 'em_andamento', // 'pendente', 'em_andamento', 'concluida'
  data_prazo: '2025-05-10T23:59:59.000Z',
  data_criacao: '2025-05-08T10:00:00.000Z',
  tags: ['desenvolvimento', 'frontend', 'core'],
  sessoes_associadas: [
    { id: 's1', tipo: 'foco', duracao: 25, data: '2025-05-09T14:00:00Z', concluida: true },
    { id: 's2', tipo: 'pausa_curta', duracao: 5, data: '2025-05-09T14:25:00Z', concluida: true },
  ]
};

const TaskDetailsScreen = ({ route, navigation }) => {
  // const { taskId } = route.params; // Receber taskId da navegação
  // No momento, usando mockTask
  const task = mockTask;

  if (!task) {
    return (
      <View style={styles.containerCentered}>
        <Text>Carregando detalhes da tarefa...</Text>
      </View>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{task.title}</Text>
      
      <View style={styles.detailSection}>
        <Text style={styles.label}>Descrição:</Text>
        <Text style={styles.value}>{task.description || 'Nenhuma descrição fornecida.'}</Text>
      </View>

      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.value, styles[`status_${task.status}`]]}>{task.status.replace('_', ' ')}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Prazo:</Text>
          <Text style={styles.value}>{formatDate(task.data_prazo)}</Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Pomodoros Estimados:</Text>
          <Text style={styles.value}>{task.pomodoros_estimados}</Text>
        </View>
        <View style={styles.detailItem}>
          <Text style={styles.label}>Pomodoros Realizados:</Text>
          <Text style={styles.value}>{task.pomodoros_realizados}</Text>
        </View>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.label}>Tags:</Text>
        <View style={styles.tagsContainer}>
          {task.tags && task.tags.length > 0 ? (
            task.tags.map((tag, index) => (
              <View key={index} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
            ))
          ) : (
            <Text style={styles.value}>Nenhuma tag</Text>
          )}
        </View>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.label}>Criada em:</Text>
        <Text style={styles.value}>{formatDate(task.data_criacao)}</Text>
      </View>

      {/* Botões de Ação */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => console.log('Iniciar Pomodoro para esta tarefa') /* navigation.navigate('TimerScreen', { taskId: task.id, taskTitle: task.title }) */}
        >
          <Text style={styles.actionButtonText}>Iniciar Pomodoro</Text>
        </TouchableOpacity>
        <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => console.log('Editar Tarefa') /* navigation.navigate('EditTaskScreen', { taskId: task.id }) */}
        >
          <Text style={styles.actionButtonText}>Editar Tarefa</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => console.log("Voltar") /* navigation.goBack() */}>
        <Text style={styles.backLink}>Voltar</Text>
      </TouchableOpacity>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  containerCentered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ff6347',
    marginBottom: 20,
    textAlign: 'center',
  },
  detailSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailItem: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginRight: 5, // Espaçamento entre itens da linha
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  status_pendente: { color: '#FFA500' /* Orange */ },
  status_em_andamento: { color: '#4682B4' /* SteelBlue */ },
  status_concluida: { color: '#32CD32' /* LimeGreen */, textDecorationLine: 'line-through' },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#ffdab9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    color: '#ff6347',
    fontSize: 12,
  },
  actionsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#ff6347',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: '#777',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backLink: {
      fontSize: 16,
      color: '#ff6347',
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 20,
      textDecorationLine: 'underline'
  }
});

export default TaskDetailsScreen;

