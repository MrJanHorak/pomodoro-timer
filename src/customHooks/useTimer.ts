import { useState, useEffect, useRef } from 'react';

export const useTimer = (
  userWorkMinutes: number,
  userBreakMinutes: number,
  isRunning: boolean,
  onComplete: () => void,
  switchTimer: () => void
) => {
  const [minutes, setMinutes] = useState(userWorkMinutes);
  const [seconds, setSeconds] = useState(0);
  const [phase, setPhase] = useState('work');
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const minutesRef = useRef(minutes);
  minutesRef.current = minutes;

  const secondsRef = useRef(seconds);
  secondsRef.current = seconds;

  useEffect(() => {
    setMinutes(phase === 'work' ? userWorkMinutes : userBreakMinutes);
  }, [userWorkMinutes, userBreakMinutes, phase]);

  useEffect(() => {
    let interval: number;

    if (isRunning && (minutes > 0 || seconds > 0)) {
      interval = window.setInterval(() => {
        if (secondsRef.current > 0) {
          setSeconds(secondsRef.current - 1);
        } else {
          setMinutes(minutesRef.current - 1);
          setSeconds(59);
        }
        // }
      }, 1000);
    } else if (secondsRef.current === 0) {
      if (minutesRef.current === 0) {
        const newPhase = phaseRef.current === 'work' ? 'break' : 'work';
        setMinutes(newPhase === 'work' ? userWorkMinutes : userBreakMinutes);
        setPhase(newPhase);
      }
    }
    return () => window.clearInterval(interval);
  }, [minutes, seconds, isRunning, phase]);

  useEffect(() => {
    if (phase === 'work') {
      setMinutes(userWorkMinutes);
    } else {
      setMinutes(userBreakMinutes);
    }
  }, [phase]);

  useEffect(() => {
    onComplete();
  }, [phase]);

  useEffect(() => {
    switchTimer();
  }, [phase]);

  return { minutes, setMinutes, seconds, setSeconds, phase };
};
