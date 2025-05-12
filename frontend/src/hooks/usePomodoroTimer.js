//frontend/src/hooks/usePomodoroTimer.js
import { useState, useEffect, useRef } from 'react';

const usePomodoroTimer = (initialFocusTime = 25 * 60, initialBreakTime = 5 * 60) => {
  const [time, setTime] = useState(initialFocusTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(true); // true for focus, false for break
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  useEffect(() => {
    if (time === 0) {
      clearInterval(timerRef.current);
      setIsRunning(false);
      if (isFocusMode) {
        // Focus session ended, start break
        setIsFocusMode(false);
        setTime(initialBreakTime);
        // Potentially trigger a notification for break start
      } else {
        // Break session ended, start new focus session
        setIsFocusMode(true);
        setTime(initialFocusTime);
        setCyclesCompleted(prevCycles => prevCycles + 1);
        // Potentially trigger a notification for focus start
      }
      // Consider auto-starting the next session or waiting for user input
    }
  }, [time, isFocusMode, initialFocusTime, initialBreakTime]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setIsFocusMode(true);
    setTime(initialFocusTime);
    setCyclesCompleted(0);
  };

  const skipToBreak = () => {
    if (isFocusMode) {
      clearInterval(timerRef.current);
      setIsRunning(false);
      setIsFocusMode(false);
      setTime(initialBreakTime);
    }
  };

  const skipToFocus = () => {
    if (!isFocusMode) {
      clearInterval(timerRef.current);
      setIsRunning(false);
      setIsFocusMode(true);
      setTime(initialFocusTime);
    }
  };

  return {
    time,
    isRunning,
    isFocusMode,
    cyclesCompleted,
    startTimer,
    pauseTimer,
    resetTimer,
    skipToBreak,
    skipToFocus,
    formattedTime: `${Math.floor(time / 60).toString().padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`,
  };
};

export default usePomodoroTimer;
