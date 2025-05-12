//frontend/src/screens/TimerScreen.js
import { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AppState, Alert } from 'react-native';
import api from '../services/api';
import usePomodoroTimer from '../hooks/usePomodoroTimer';

const TimerScreen = ({ route, navigation }) => {
  const { taskId, taskTitle } = route.params || {};
  const [sessionId, setSessionId] = useState(null);
  const [stats, setStats] = useState({ sessoesHoje: 0, minutosHoje: 0 });

  const { 
    time, 
    isRunning, 
    isFocusMode,
    startTimer, 
    pauseTimer, 
    resetTimer,
    formattedTime
  } = usePomodoroTimer();

  const fetchStats = async () => {
    try {
      const response = await api.get('/sessions/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  const handleStartSession = async () => {
    try {
      const response = await api.post('/sessions', {
        tarefa_id: taskId,
        tipo_sessao: 'foco',
        duracao_configurada: 25 // Poderia vir das configurações
      });
      setSessionId(response.data.data.sessao._id);
      startTimer();
      fetchStats();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao iniciar sessão');
    }
  };

  const handleEndSession = async () => {
    try {
      await api.patch(`/sessions/${sessionId}`, {
        status: isFocusMode ? 'concluida' : 'interrompida'
      });
      fetchStats();
    } catch (error) {
      console.error('Erro ao finalizar sessão:', error);
    }
  };

  // Efeito para finalizar sessão quando o timer chegar a zero
  useEffect(() => {
    if (time === 0 && sessionId) {
      handleEndSession();
    }
  }, [time]);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formattedTime}</Text>
      <View style={styles.statsContainer}>
        <Text>Sessões hoje: {stats.sessoesHoje}</Text>
        <Text>Minutos focados: {stats.minutosHoje}</Text>
      </View>
      {/* Restante do JSX */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  focusBg: {
    backgroundColor: '#FF6347', // Tomato para foco
  },
  breakBg: {
    backgroundColor: '#4682B4', // SteelBlue para pausa
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  modeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: 30,
  },
  mainButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  startButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  pauseButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  controlButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  sessionCountText: {
    fontSize: 16,
    color: '#eee',
    marginBottom: 20,
  },
  backLink: {
      fontSize: 18,
      color: '#fff',
      marginTop: 20,
      textDecorationLine: 'underline'
  }
});

export default TimerScreen;

