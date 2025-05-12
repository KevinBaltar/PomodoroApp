//frontend/src/components/Pomodoro/TimerDisplay.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TimerDisplay = ({ currentTime }) => {
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(currentTime)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default TimerDisplay;
