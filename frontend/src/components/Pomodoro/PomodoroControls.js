//frontend/src/components/Pomodoro/PomodoroControls.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Button from '../UI/Button'; // Assuming Button component is in UI folder

const PomodoroControls = ({ onStart, onPause, onReset, isRunning, isPaused }) => {
  return (
    <View style={styles.controlsContainer}>
      {!isRunning && !isPaused && (
        <Button title="Iniciar" onPress={onStart} style={styles.button} />
      )}
      {isRunning && !isPaused && (
        <Button title="Pausar" onPress={onPause} style={[styles.button, styles.pauseButton]} />
      )}
      {isPaused && (
        <Button title="Retomar" onPress={onStart} style={styles.button} />
      )}
      {(isRunning || isPaused) && (
        <Button title="Resetar" onPress={onReset} style={[styles.button, styles.resetButton]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%',
    marginVertical: 20,
  },
  button: {
    minWidth: 100,
  },
  pauseButton: {
    backgroundColor: '#ffc107', // Yellow for pause
  },
  resetButton: {
    backgroundColor: '#dc3545', // Red for reset
  },
});

export default PomodoroControls;
