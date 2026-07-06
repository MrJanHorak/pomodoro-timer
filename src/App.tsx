import { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';

// assets
import beepingSound from './assets/sounds/Quick-beep-sound-effect.mp3';

// custom hooks
import { useTimer } from './customHooks/useTimer.ts';
import { useGradientColors } from './customHooks/useGradientColors.ts';
import { useWorkBreakSettings } from './customHooks/useWorkBreakSettings.ts';
import { useSessionTracking } from './customHooks/useSessionTracking.ts';
import { useBeepSound } from './customHooks/useBeepSound.ts';
import { useDocumentChrome } from './customHooks/useDocumentChrome.ts';
import { useInstructionsModal } from './customHooks/useInstructionsModal.ts';

// components & data
import InstructionsModal from './components/InstructionsModal.tsx';
import SettingsModal from './components/SettingsModal.tsx';
import { MUSIC_OPTIONS, buildSoundCloudSrc } from './customHooks/musicOptions.ts';

function App() {
  const ANALYTICS_CONSENT_KEY = 'pomodoro-analytics-consent';
  const [showSettings, setShowSettings] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [musicIndex, setMusicIndex] = useState(0); // 0 = "No music"
  const [analyticsAvailable, setAnalyticsAvailable] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState<
    'granted' | 'denied' | null
  >(() => {
    const savedValue = localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return savedValue === 'granted' || savedValue === 'denied'
      ? savedValue
      : null;
  });

  const { workSessions, recordCompletedPhase, recordPhaseSwitch } =
    useSessionTracking();
  const playBeep = useBeepSound(beepingSound);

  const switchTimer = useCallback(() => {
    recordPhaseSwitch();
    playBeep();
  }, [recordPhaseSwitch, playBeep]);

  // Settings must be resolved before useTimer, since useTimer needs the
  // work/break minute values as inputs.
  const {
    userWorkMinutes,
    userBreakMinutes,
    setUserWorkMinutes,
    handleWorkMinutesChange,
    handleBreakMinutesChange,
    addMinute,
    subtractMinute,
    addMinuteToBreak,
    subtractMinuteFromBreak,
  } = useWorkBreakSettings({ isRunning });

  const { minutes, seconds, setMinutes, setSeconds, phase, setPhase } =
    useTimer(
      userWorkMinutes,
      userBreakMinutes,
      isRunning,
      recordCompletedPhase,
      switchTimer
    );

  // Keeps the live countdown display in sync when the user edits "Work
  // Minutes" directly (typing, or the +/- buttons), matching the original
  // behavior of updating the on-screen clock immediately rather than only
  // on the next phase change.
  useEffect(() => {
    setMinutes(userWorkMinutes);
  }, [userWorkMinutes, setMinutes]);

  const { color1, setColor1, color2, setColor2 } = useGradientColors(phase);

  const displayTime = useDocumentChrome({
    phase,
    minutes,
    seconds,
    userWorkMinutes,
    userBreakMinutes,
  });

  const { showInstructions, closeInstructions, openInstructions } =
    useInstructionsModal();

  const groupedMusicOptions = useMemo(() => {
    const grouped = new Map<string, Array<{ index: number; label: string }>>();

    MUSIC_OPTIONS.forEach((option, index) => {
      const optionsForCategory = grouped.get(option.category) ?? [];
      optionsForCategory.push({ index, label: option.label });
      grouped.set(option.category, optionsForCategory);
    });

    return [...grouped.entries()];
  }, []);

  // Derived instead of stored: this used to be its own piece of state kept
  // in sync from six different call sites (every settings handler, the
  // preset buttons, and the phase-switch logic). It's fully determined by
  // phase + the two minute settings, so there's nothing left to keep in
  // sync manually.
  const totalSeconds =
    (phase === 'work' ? userWorkMinutes : userBreakMinutes) * 60;

  const circleColor = phase === 'work' ? color1 : color2;
  const phaseLabel = phase === 'work' ? 'Focus' : 'Break';

  const updateAnalyticsConsent = useCallback(
    (consent: 'granted' | 'denied') => {
      if (!analyticsAvailable) return;

      const gtag = (
        window as Window & {
          gtag?: (
            command: string,
            action: string,
            params: { analytics_storage: 'granted' | 'denied' }
          ) => void;
        }
      ).gtag;

      gtag?.('consent', 'update', { analytics_storage: consent });
    },
    [analyticsAvailable]
  );

  useEffect(() => {
    const gtag = (window as Window & { gtag?: unknown }).gtag;
    setAnalyticsAvailable(typeof gtag === 'function');
  }, []);

  useEffect(() => {
    if (!analyticsAvailable) return;
    updateAnalyticsConsent(analyticsConsent ?? 'denied');
  }, [analyticsAvailable, analyticsConsent, updateAnalyticsConsent]);

  const setAnalyticsConsentChoice = (choice: 'granted' | 'denied') => {
    setAnalyticsConsent(choice);
    localStorage.setItem(ANALYTICS_CONSENT_KEY, choice);
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const setTimer = (presetMinutes: number) => {
    setUserWorkMinutes(presetMinutes);
    setPhase('work');
    setMinutes(presetMinutes);
    setSeconds(0);
    setIsRunning(false);
  };

  const stopTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setMinutes(userWorkMinutes);
    setPhase('work');
    setSeconds(0);
    setIsRunning(false);
  };

  return (
    <div className='App'>
      <div className='timer-container'>
        <div className='circle-container'>
          <div className='button-container'>
            {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map(
              (minute, index) => (
                <button
                  key={minute}
                  className={`button-${index}`}
                  onClick={() => setTimer(minute)}
                >
                  {minute}
                </button>
              )
            )}
          </div>
          <div
            style={{
              backgroundColor: circleColor,
              animation: isRunning
                ? `countdown ${totalSeconds}s linear infinite`
                : 'none',
            }}
            className={`countdown-circle countdown`}
          ></div>
          <div className='time-display'>{displayTime}</div>
        </div>
      </div>

      <div className='phase-display'>{phaseLabel}</div>

      <div id='control-buttons-container'>
        <button className='start-button' onClick={toggleTimer}>
          {isRunning ? 'Pause' : 'Start'}
        </button>

        <button className='stop-button' onClick={stopTimer}>
          Stop
        </button>

        <button className='reset-button' onClick={resetTimer}>
          Reset
        </button>
      </div>
      <h3>Focus Sessions: {workSessions}</h3>

      {musicIndex !== 0 && (
        <div style={{ position: 'absolute', zIndex: -1 }}>
          <iframe
            key={musicIndex}
            width='100%'
            height='166'
            title={MUSIC_OPTIONS[musicIndex].label}
            allow='autoplay'
            src={buildSoundCloudSrc(MUSIC_OPTIONS[musicIndex].trackUrl)}
          />
          <p className='music-attribution'>
            Playing: {MUSIC_OPTIONS[musicIndex].label} (via SoundCloud)
          </p>
        </div>
      )}

      <div id='utility-buttons-container'>
        <button
          className='icon-button'
          onClick={() => setShowSettings(!showSettings)}
          aria-label={showSettings ? 'Close settings' : 'Show settings'}
          title={showSettings ? 'Close settings' : 'Show settings'}
        >
          <svg viewBox='0 0 24 24' aria-hidden='true' fill='currentColor'>
            <path d='M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.08 7.08 0 0 0-1.63-.94l-.36-2.54a.5.5 0 0 0-.49-.42h-3.84a.5.5 0 0 0-.49.42l-.36 2.54c-.58.23-1.13.54-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22l-1.92 3.32a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L2.87 14.52a.5.5 0 0 0-.12.64l1.92 3.32c.13.22.39.31.6.22l2.39-.96c.5.4 1.05.71 1.63.94l.36 2.54c.04.24.25.42.49.42h3.84c.24 0 .45-.18.49-.42l.36-2.54c.58-.23 1.13-.54 1.63-.94l2.39.96c.22.09.47 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5z' />
          </svg>
        </button>
        <button
          className='icon-button'
          aria-label='Show instructions'
          title='Show instructions'
          onClick={openInstructions}
        >
          ?
        </button>
      </div>

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)}>
          <div className='settings-content'>
            <section className='settings-section'>
              <p className='settings-section-title'>Focus music</p>
              <p className='settings-helper'>
                Choose a sound profile for focus blocks.
              </p>
              <select
                className='settings-select'
                id='music-select'
                value={musicIndex}
                onChange={(e) => setMusicIndex(Number(e.target.value))}
              >
                {groupedMusicOptions.map(([category, options]) =>
                  category === 'General' ? (
                    options.map((option) => (
                      <option key={`${category}-${option.index}`} value={option.index}>
                        {option.label}
                      </option>
                    ))
                  ) : (
                    <optgroup key={category} label={category}>
                      {options.map((option) => (
                        <option key={`${category}-${option.index}`} value={option.index}>
                          {option.label}
                        </option>
                      ))}
                    </optgroup>
                  )
                )}
              </select>
            </section>

            <section className='settings-section'>
              <p className='settings-section-title'>Session lengths</p>
              <div className='settings-row'>
                <label htmlFor='work-minutes'>Focus</label>
                <div className='settings-stepper'>
                  <button
                    className='plus-minus'
                    onClick={() => subtractMinute(minutes)}
                    aria-label='Decrease focus minutes'
                  >
                    -
                  </button>

                  <input
                    id='work-minutes'
                    className='settings-number-input'
                    type='number'
                    min={1}
                    max={180}
                    value={userWorkMinutes}
                    onChange={handleWorkMinutesChange}
                  />

                  <button
                    className='plus-minus'
                    onClick={addMinute}
                    aria-label='Increase focus minutes'
                  >
                    +
                  </button>
                </div>
              </div>

              <div className='settings-row'>
                <label htmlFor='break-minutes'>Break</label>
                <div className='settings-stepper'>
                  <button
                    className='plus-minus'
                    onClick={subtractMinuteFromBreak}
                    aria-label='Decrease break minutes'
                  >
                    -
                  </button>
                  <input
                    id='break-minutes'
                    className='settings-number-input'
                    type='number'
                    min={1}
                    max={60}
                    value={userBreakMinutes}
                    onChange={handleBreakMinutesChange}
                  />
                  <button
                    className='plus-minus'
                    onClick={addMinuteToBreak}
                    aria-label='Increase break minutes'
                  >
                    +
                  </button>
                </div>
              </div>
            </section>

            <section className='settings-section'>
              <p className='settings-section-title'>Theme colors</p>
              <div className='settings-color-grid'>
                <div className='settings-color-item'>
                  <label htmlFor='color1'>Focus phase</label>
                  <input
                    type='color'
                    id='color1'
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                  />
                </div>
                <div className='settings-color-item'>
                  <label htmlFor='color2'>Break phase</label>
                  <input
                    type='color'
                    id='color2'
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                  />
                </div>
              </div>
            </section>
          </div>
        </SettingsModal>
      )}

      {showInstructions && <InstructionsModal onClose={closeInstructions} />}

      <footer className='app-footer'>
        <span className='footer-links'>
          <a
            href='https://github.com/MrJanHorak/pomodoro-timer'
            target='_blank'
            rel='noreferrer'
            aria-label='GitHub repository'
            title='GitHub repository'
          >
            <svg
              className='footer-icon'
              viewBox='0 0 24 24'
              aria-hidden='true'
              fill='currentColor'
            >
              <path d='M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.386-1.333-1.755-1.333-1.755-1.09-.745.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.776.418-1.305.76-1.605-2.665-.3-5.467-1.332-5.467-5.93 0-1.31.467-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.49 11.49 0 0 1 3.005-.404c1.02.005 2.045.138 3.005.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.233 1.91 1.233 3.22 0 4.61-2.807 5.625-5.48 5.92.43.372.823 1.102.823 2.222 0 1.604-.015 2.896-.015 3.286 0 .322.218.694.825.576 4.765-1.586 8.202-6.082 8.202-11.384 0-6.627-5.373-12-12-12z' />
            </svg>
          </a>
          <span className='footer-divider' aria-hidden='true'></span>
          <a
            href='https://www.linkedin.com/in/jan-horak/'
            target='_blank'
            rel='noreferrer'
            aria-label='LinkedIn profile'
            title='LinkedIn profile'
          >
            <svg
              className='footer-icon'
              viewBox='0 0 24 24'
              aria-hidden='true'
              fill='currentColor'
            >
              <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.026-3.037-1.852-3.037-1.852 0-2.136 1.445-2.136 2.939v5.667h-3.554v-11.452h3.414v1.561h.049c.476-.9 1.637-1.85 3.369-1.85 3.601 0 4.268 2.37 4.268 5.455v6.286zm-14.693-13.02c-1.144 0-2.069-.926-2.069-2.069 0-1.144.925-2.069 2.069-2.069s2.069.925 2.069 2.069c0 1.143-.925 2.069-2.069 2.069zm1.777 13.02h-3.554v-11.452h3.554v11.452zm14.246-20.452h-19.555c-1.223 0-2.215.968-2.215 2.162v19.676c0 1.194.992 2.162 2.215 2.162h19.555c1.223 0 2.223-.968 2.223-2.162v-19.676c0-1.194-1-2.162-2.223-2.162z' />
            </svg>
          </a>
        </span>

        {analyticsAvailable && analyticsConsent === null && (
          <span className='footer-consent'>
            Analytics?
            <button onClick={() => setAnalyticsConsentChoice('granted')}>
              Allow
            </button>
            <button onClick={() => setAnalyticsConsentChoice('denied')}>
              No thanks
            </button>
          </span>
        )}
      </footer>
    </div>
  );
}

export default App;
