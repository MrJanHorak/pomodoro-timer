import { useState } from 'react';

const STORAGE_KEY = 'pomodoro-instructions-seen';

export const useInstructionsModal = () => {
  const [showInstructions, setShowInstructions] = useState(
    () => localStorage.getItem(STORAGE_KEY) !== 'true'
  );

  const closeInstructions = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setShowInstructions(false);
  };

  const openInstructions = () => setShowInstructions(true);

  return { showInstructions, closeInstructions, openInstructions };
};
