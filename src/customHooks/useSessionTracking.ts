import { useState } from 'react';

const getTodayKey = () => new Date().toISOString().split('T')[0];

const getWorkSessionsForDay = (date: string) =>
  Number(localStorage.getItem(date)) || 0;

export const useSessionTracking = () => {
  // Reads today's count from localStorage on mount, so the number on
  // screen matches what's actually been recorded instead of resetting to
  // 0 on every page reload.
  const [workSessions, setWorkSessions] = useState(() =>
    getWorkSessionsForDay(getTodayKey())
  );
  const [sessionCounter, setSessionCounter] = useState(0);

  const recordCompletedPhase = () => {
    const today = getTodayKey();
    const currentCount = localStorage.getItem(today);
    localStorage.setItem(
      today,
      currentCount ? String(Number(currentCount) + 1) : '1'
    );
  };

  // A full work+break cycle takes 3 phase switches to register as one
  // completed "work session" here (work->break, break->work, work->break).
  // That threshold is unchanged from the original implementation.
  const recordPhaseSwitch = () => {
    setSessionCounter((prev) => prev + 1);
    if (sessionCounter === 2) {
      setWorkSessions((prev) => prev + 1);
      setSessionCounter(0);
    }
  };

  return { workSessions, recordCompletedPhase, recordPhaseSwitch };
};
