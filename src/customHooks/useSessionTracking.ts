import { useState, useCallback } from 'react';

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
  const [, setSessionCounter] = useState(0);

  const recordCompletedPhase = useCallback(() => {
    // Kept for API compatibility with useTimer; counting is handled in
    // recordPhaseSwitch so localStorage and on-screen workSessions stay aligned.
  }, []);

  // A full work+break cycle takes 3 phase switches to register as one
  // completed "work session" here (work->break, break->work, work->break).
  // That threshold is unchanged from the original implementation.
  const recordPhaseSwitch = useCallback(() => {
    setSessionCounter((prev) => {
      const next = prev + 1;
      if (next !== 3) return next;

      const today = getTodayKey();
      setWorkSessions((previousSessions) => {
        const updatedSessions = previousSessions + 1;
        localStorage.setItem(today, String(updatedSessions));
        return updatedSessions;
      });
      return 0;
    });
  }, []);

  return { workSessions, recordCompletedPhase, recordPhaseSwitch };
};
