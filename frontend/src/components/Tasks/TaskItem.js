//frontend/src/components/Tasks/TaskItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from '../UI/Card'; // Assuming Card component is in UI folder

const TaskItem = ({ task, onPress, onLongPress, onToggleComplete }) => {
  return (
    <TouchableOpacity onPress={() => onPress(task.id)} onLongPress={() => onLongPress && onLongPress(task.id)}>
      <Card style={[styles.taskItem, task.completed ? styles.completedTask : {}]}>
        <View style={styles.taskContent}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          {task.description && <Text style={styles.taskDescription}>{task.description}</Text>}
        </View>
        <TouchableOpacity onPress={() => onToggleComplete && onToggleComplete(task.id)} style={styles.checkbox}>
          {task.completed && <View style={styles.checkboxFilled} />}
        </TouchableOpacity>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    padding: 15,
  },
  completedTask: {
    backgroundColor: '#e0e0e0',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#007bff',
    marginLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxFilled: {
    width: 14,
    height: 14,
    backgroundColor: '#007bff',
    borderRadius: 2,
  },
});

export default TaskItem;
