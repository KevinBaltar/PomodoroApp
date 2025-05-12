import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useTasks } from '../contexts/AuthContext'; // Crie este contexto

const TasksScreen = ({ navigation }) => {
  const { tasks } = useTasks();

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => navigation.navigate('TaskDetails', { taskId: item.id })}
          >
            <Text>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default TasksScreen;