import { useState, useEffect } from 'react';
import './App.css';

// assets
import beepingSound from './assets/sounds/Quick-beep-sound-effect.mp3';

function App() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [displayTime, setDisplayTime] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [workSessions, setWorkSessions] = useState(0);
  const [userWorkMinutes, setUserWorkMinutes] = useState(25);
  const [userBreakMinutes, setUserBreakMinutes] = useState(5);
  const [totalSeconds, setTotalSeconds] = useState(userWorkMinutes * 60);

  const audio = new Audio(beepingSound);

  const playSound = () => {
    audio.play();
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const stopTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setMinutes(userWorkMinutes);
    setSeconds(0);
    setIsRunning(false);
  };

  const handleWorkMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserWorkMinutes(Number(e.target.value));
  };
  const handleBreakMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserBreakMinutes(Number(e.target.value));
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

  const switchTimer = () => {
    setIsWorkTime(!isWorkTime);
    const newMinutes = isWorkTime ? userBreakMinutes : userWorkMinutes;
    setMinutes(newMinutes);
    setTotalSeconds(newMinutes * 60);
    playSound();
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

  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = window.setInterval(() => {
        if (seconds > 0) setSeconds(seconds - 1);
        else if (seconds === 0) {
          if (minutes === 0) {
            switchTimer();
            if (isWorkTime) setMinutes(5); // break time
            else {
              setMinutes(userWorkMinutes); // work time
              setWorkSessions(workSessions + 1);
            }
          } else setMinutes(minutes - 1);
          setSeconds(59);
        }
      }, 1000);
    }
    return () => window.clearInterval(interval);
  }, [isRunning, minutes, seconds]);

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
