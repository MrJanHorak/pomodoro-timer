import { useRef, useEffect, useCallback } from 'react';

export const useBeepSound = (src: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(src);
  }, [src]);

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {
      // Autoplay can be blocked before the user has interacted with the
      // page; that's expected and not worth surfacing as an error.
    });
  }, []);

  return play;
};
