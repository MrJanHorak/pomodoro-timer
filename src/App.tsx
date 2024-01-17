import { useState, useEffect } from 'react';
import './App.css';

// assets
import beepingSound from './assets/sounds/Quick-beep-sound-effect.mp3';

// custom hooks
import { useTimer } from './customHooks/useTimer.ts';

function App() {
  // const [minutes, setMinutes] = useState(25);
  // const [seconds, setSeconds] = useState(0);
  const [displayTime, setDisplayTime] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [workSessions, setWorkSessions] = useState(0);
  const [userWorkMinutes, setUserWorkMinutes] = useState(25);
  const [userBreakMinutes, setUserBreakMinutes] = useState(5);
  const [totalSeconds, setTotalSeconds] = useState(userWorkMinutes * 60);

  const switchTimer = () => {
    setIsWorkTime(!isWorkTime);
    const newMinutes = isWorkTime ? userBreakMinutes : userWorkMinutes;
    setMinutes(newMinutes);
    setTotalSeconds(newMinutes * 60);
    playSound();
  };

  const { minutes, seconds, setMinutes, setSeconds } = useTimer(25, switchTimer, isRunning);

  const audio = new Audio(beepingSound);

  const playSound = () => {
    audio.play();
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const completeWorkSession = () => {
    const today = new Date().toISOString().split('T')[0];
    const currentCount = localStorage.getItem(today);
    localStorage.setItem(
      today,
      currentCount ? String(Number(currentCount) + 1) : '1'
    );
  };

  const getWorkSessionsForDay = (date: string) => {
    return Number(localStorage.getItem(date)) || 0;
  };

  const stopTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setMinutes(userWorkMinutes);
    setSeconds(0);
    setIsRunning(false);
  };

  const handleWorkMinutesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = parseInt(event.target.value);
    if (newValue >= 0) {
      setUserWorkMinutes(newValue);
      setMinutes(newValue);
      setTotalSeconds(newValue * 60);
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
      setUserWorkMinutes((prevMinutes) => prevMinutes + 1);
      setMinutes((prevMinutes) => prevMinutes + 1);
      setTotalSeconds((prevSeconds) => prevSeconds + 60);
    }
  };

  const subtractMinute = () => {
    if (!isRunning) {
      if (totalSeconds > 60) {
        setUserWorkMinutes((prevMinutes) => prevMinutes - 1);
        setMinutes((prevMinutes) => prevMinutes - 1);
        setTotalSeconds((prevSeconds) => prevSeconds - 60);
      }
    }
  };

  useEffect(() => {
    const countdownElement = document.querySelector(
      '.countdown'
    ) as HTMLElement;
    if (countdownElement) {
      countdownElement.style.animationDuration = `${userWorkMinutes * 60}s`;
    }
    setDisplayTime(
      `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`
    );
  }, [minutes, seconds, totalSeconds, userWorkMinutes]);

  return (
    <div className='App'>
      <h1>Pomodoro Timer</h1>
      <label htmlFor='work-minutes'>Work Minutes</label>
      <input
        type='number'
        value={userWorkMinutes}
        onChange={handleWorkMinutesChange}
      />
      <label htmlFor='break-minutes'>Break Minutes</label>
      <input
        type='number'
        value={userBreakMinutes}
        onChange={handleBreakMinutesChange}
      />
      <label htmlFor='progress'>Progress</label>
      <progress
        value={(totalSeconds - minutes * 60 - seconds) / totalSeconds}
        max='1'
      />
      <div className='timer-container'>
        <button className={'plus-minus'} onClick={subtractMinute}>
          -
        </button>
        <div className='circle-container'>
          <div
            className={`countdown-circle ${isRunning ? 'countdown' : ''}`}
          ></div>
          <div className='time-display'>{displayTime}</div>
        </div>
        <button className={'plus-minus'} onClick={addMinute}>
          +
        </button>
      </div>
      <button className='start-button' onClick={toggleTimer}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button className='stop-button' onClick={stopTimer}>
        Stop
      </button>
      <button className='reset-button' onClick={resetTimer}>
        Reset
      </button>
      <h3>Work Sessions: {workSessions}</h3>
    </div>
  );
}

export default App;
