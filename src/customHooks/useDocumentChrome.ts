import { useState, useEffect } from 'react';

const createProgressSVG = (progress: number, color: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="14" stroke="#999" stroke-width="6" fill="none" />
  <circle cx="16" cy="16" r="14" stroke="${color}" stroke-width="6" fill="none" stroke-dasharray="${
    progress * 100
  }, 100" transform="rotate(-90 16 16)" />
</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const setFavicon = (url: string) => {
  const link =
    (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
    document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = url;
  document.getElementsByTagName('head')[0].appendChild(link);
};

interface Params {
  phase: string;
  minutes: number;
  seconds: number;
  userWorkMinutes: number;
  userBreakMinutes: number;
}

/**
 * Keeps the tab title, favicon (a tiny progress ring), and the `--progress`
 * CSS custom property in sync with the countdown, once per second.
 *
 * `--progress` is registered via `@property` in App.css and `.App`'s
 * background transitions on it, so this per-second update now animates
 * smoothly between ticks instead of snapping straight to the new value.
 */
export const useDocumentChrome = ({
  phase,
  minutes,
  seconds,
  userWorkMinutes,
  userBreakMinutes,
}: Params) => {
  const [displayTime, setDisplayTime] = useState('');

  useEffect(() => {
    const totalPhaseMinutes =
      phase === 'work' ? userWorkMinutes : userBreakMinutes;
    const progress =
      totalPhaseMinutes > 0
        ? (totalPhaseMinutes * 60 - (minutes * 60 + seconds)) /
          (totalPhaseMinutes * 60)
        : 0;
    const faviconColor = phase === 'work' ? 'red' : 'yellow';

    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;

    setDisplayTime(formattedTime);
    document.title = `${formattedTime} - Pomodoro Timer`;
    setFavicon(createProgressSVG(progress, faviconColor));

    const app = document.querySelector('.App') as HTMLElement | null;
    app?.style.setProperty('--progress', `${progress * 100}%`);
  }, [phase, minutes, seconds, userWorkMinutes, userBreakMinutes]);

  return displayTime;
};
