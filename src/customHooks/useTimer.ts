import { useState, useEffect } from 'react';

export const useTimer = (userWorkMinutes: number, userBreakMinutes: number, isRunning: boolean, onComplete: () => void ) => {
  const [minutes, setMinutes] = useState(userWorkMinutes);
  const [seconds, setSeconds] = useState(0);
  const [phase, setPhase] = useState('work'); // Add this line

  useEffect(() => {
    let interval: number;
    if (isRunning && (minutes > 0 || seconds > 0)) {
      interval = window.setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (seconds === 0) {
          if (minutes === 0) {
            onComplete();
            // switchTimer();
            setPhase(prevPhase => prevPhase === 'work' ? 'break' : 'work'); // Add this line
            setMinutes(phase === 'work' ? userBreakMinutes : userWorkMinutes); // Add this lineAdd this line
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    }
    return () => window.clearInterval(interval);
  }, [minutes, seconds, isRunning]);

  return { minutes, seconds, setMinutes, setSeconds, phase }; // Add 'phase' here
};