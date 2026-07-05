import { useState, useEffect } from 'react';
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
import { MUSIC_OPTIONS, buildSoundCloudSrc } from './customHooks/musicOptions.ts';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [musicIndex, setMusicIndex] = useState(0); // 0 = "No music"

  const { workSessions, recordCompletedPhase, recordPhaseSwitch } =
    useSessionTracking();
  const playBeep = useBeepSound(beepingSound);

  const switchTimer = () => {
    recordPhaseSwitch();
    playBeep();
  };

  // Settings must be resolved before useTimer, since useTimer needs the
  // work/break minute values as inputs.
  const {
    userWorkMinutes,
    userBreakMinutes,
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
  }, [userWorkMinutes]);

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

  // Derived instead of stored: this used to be its own piece of state kept
  // in sync from six different call sites (every settings handler, the
  // preset buttons, and the phase-switch logic). It's fully determined by
  // phase + the two minute settings, so there's nothing left to keep in
  // sync manually.
  const totalSeconds =
    (phase === 'work' ? userWorkMinutes : userBreakMinutes) * 60;

  const circleColor = phase === 'work' ? color1 : color2;

  const toggleTimer = () => setIsRunning(!isRunning);

  const setTimer = (presetMinutes: number) => {
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

      <div className='phase-display'>{phase}</div>

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
      <h3>Work Sessions: {workSessions}</h3>

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
        <button onClick={() => setShowSettings(!showSettings)}>
          {showSettings ? 'Hide Settings' : 'Show Settings'}
        </button>
        <button aria-label='Show instructions' onClick={openInstructions}>
          ?
        </button>
      </div>

      {showSettings && (
        <>
          <label htmlFor='music-select'>Focus music</label>
          <div>
            <select
              id='music-select'
              value={musicIndex}
              onChange={(e) => setMusicIndex(Number(e.target.value))}
            >
              {MUSIC_OPTIONS.map((option, index) => (
                <option key={option.label} value={index}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <label htmlFor='work-minutes'>Work Minutes</label>
          <div className='set-work-minutes-container'>
            <button
              className={'plus-minus'}
              onClick={() => subtractMinute(minutes)}
            >
              -
            </button>

            <input
              id='work-minutes'
              type='number'
              min={1}
              max={180}
              value={userWorkMinutes}
              onChange={handleWorkMinutesChange}
            />

            <button className={'plus-minus'} onClick={addMinute}>
              +
            </button>
          </div>

          <label htmlFor='break-minutes'>Break Minutes</label>
          <div className='set-break-container'>
            <button className={'plus-minus'} onClick={subtractMinuteFromBreak}>
              -
            </button>
            <input
              id='break-minutes'
              type='number'
              min={1}
              max={60}
              value={userBreakMinutes}
              onChange={handleBreakMinutesChange}
            />
            <button className={'plus-minus'} onClick={addMinuteToBreak}>
              +
            </button>
          </div>
          <label htmlFor='color1'>Work phase color:</label>
          <input
            type='color'
            id='color1'
            value={color1}
            onChange={(e) => setColor1(e.target.value)}
          />
          <label htmlFor='color2'>Break phase color:</label>
          <input
            type='color'
            id='color2'
            value={color2}
            onChange={(e) => setColor2(e.target.value)}
          />
        </>
      )}

      {showInstructions && <InstructionsModal onClose={closeInstructions} />}
    </div>
  );
}

export default App;
