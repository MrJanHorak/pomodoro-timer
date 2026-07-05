import { useState, useEffect } from 'react';

/**
 * Owns the work/break color pickers and keeps the on-screen gradient in
 * sync with them automatically.
 *
 * Previously this logic was split across two functions the rest of the app
 * had to remember to call at the right time: `setGradients()` (wired to the
 * color `<input>`s) always applied color-start = color1 / color-end =
 * color2, while `switchGreadients()` (called only on a phase switch)
 * applied it in reverse during work phase. That meant editing a color
 * picker mid-phase and a phase switch could each leave the gradient in a
 * different, inconsistent state. Folding both into one effect keyed on
 * every relevant input (phase, color1, color2) means there's exactly one
 * rule for what the gradient should look like, and it can't go stale.
 */
export const useGradientColors = (phase: string) => {
  const [color1, setColor1] = useState('#4ADEDE');
  const [color2, setColor2] = useState('#5ADAAE');

  useEffect(() => {
    const app = document.querySelector('.App') as HTMLElement | null;
    if (!app) return;

    const [startColor, endColor] =
      phase === 'work' ? [color2, color1] : [color1, color2];

    app.style.setProperty('--color-start', startColor);
    app.style.setProperty('--color-end', endColor);
  }, [phase, color1, color2]);

  return { color1, setColor1, color2, setColor2 };
};
