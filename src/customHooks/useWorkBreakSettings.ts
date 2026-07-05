import { useState } from 'react';

interface Params {
  isRunning: boolean;
}

/**
 * Owns the work/break minute settings and their handlers.
 *
 * Note: this hook intentionally does NOT touch the live countdown display
 * (that lives in useTimer). Syncing "user changed work minutes" -> "update
 * the on-screen clock" is handled by a small effect in App.tsx instead,
 * because useTimer needs userWorkMinutes/userBreakMinutes as inputs, which
 * creates a circular dependency if this hook also depended on useTimer's
 * setMinutes output.
 */
export const useWorkBreakSettings = ({ isRunning }: Params) => {
  const [userWorkMinutes, setUserWorkMinutes] = useState(25);
  const [userBreakMinutes, setUserBreakMinutes] = useState(5);

  const handleWorkMinutesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = parseInt(event.target.value);
    if (newValue >= 0) {
      setUserWorkMinutes(newValue);
    }
  };

  const handleBreakMinutesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = parseInt(event.target.value);
    if (newValue >= 0) {
      setUserBreakMinutes(newValue);
    }
  };

  const addMinute = () => {
    if (!isRunning) {
      setUserWorkMinutes((prev) => prev + 1);
    }
  };

  const subtractMinute = (currentDisplayMinutes: number) => {
    if (!isRunning && currentDisplayMinutes > 0) {
      setUserWorkMinutes((prev) => prev - 1);
    }
  };

  const addMinuteToBreak = () => {
    if (!isRunning) {
      setUserBreakMinutes((prev) => prev + 1);
    }
  };

  const subtractMinuteFromBreak = () => {
    if (!isRunning) {
      setUserBreakMinutes((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  return {
    userWorkMinutes,
    userBreakMinutes,
    setUserWorkMinutes,
    setUserBreakMinutes,
    handleWorkMinutesChange,
    handleBreakMinutesChange,
    addMinute,
    subtractMinute,
    addMinuteToBreak,
    subtractMinuteFromBreak,
  };
};
