// useTimer.ts
import { useState, useEffect } from 'react';

export const useTimer = (initialMinutes: number, switchTimer: () => void, isRunning: boolean, onComplete: () => void ) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: number;
    if (isRunning && (minutes > 0 || seconds > 0)) {
      interval = window.setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (seconds === 0) {
          if (minutes === 0) {
            onComplete();
            switchTimer();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    }
    return () => window.clearInterval(interval);
  }, [minutes, seconds, isRunning]);

  return { minutes, seconds, setMinutes, setSeconds };
};