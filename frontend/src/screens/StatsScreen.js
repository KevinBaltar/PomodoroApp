//frontend/src/screens/StatsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import api from '../services/api';
const StatsScreen = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/users/statistics');
        setStats(response.data.data.estatisticas);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Text>Carregando...</Text>;

  const chartData = {
    labels: stats?.historico_desempenho_diario?.slice(0, 7).map(d => d._id.split('-')[2]) || [],
    datasets: [{
      data: stats?.historico_desempenho_diario?.slice(0, 7).map(d => d.totalPomodoros) || []
    }]
  };

  return (
    <ScrollView style={styles.container}>
      <BarChart
        data={chartData}
        width={Dimensions.get('window').width - 40}
        height={220}
        yAxisLabel="P"
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6347',
    textAlign: 'center',
    marginVertical: 20,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  summaryBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%', // Para dois boxes por linha
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff6347',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
  },
  chartContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  chartPlaceholder: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 8,
  },
  insightsContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  insightText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    lineHeight: 20,
  },
});

export default StatsScreen;

