import { useState, useEffect } from 'react';
import './App.css';

// assets
import beepingSound from '/public/sounds/Quick-beep-sound-effect.mp3';

function App() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [displayTime, setDisplayTime] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [workSessions, setWorkSessions] = useState(0);
  const [userWorkMinutes, setUserWorkMinutes] = useState(25);
  const [userBreakMinutes, setUserBreakMinutes] = useState(5);

  const audio = new Audio(beepingSound);

  const playSound = () => {
    audio.play();
  };

  const startTimer = () => setIsRunning(true);
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

  const switchTimer = () => {
    setIsWorkTime(!isWorkTime);
    setMinutes(isWorkTime ? userBreakMinutes : userWorkMinutes);
    playSound();
  };

  useEffect(() => {
    setDisplayTime(
      `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}`
    );
  }, [minutes, seconds]);

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
              setMinutes(25); // work time
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
      <input
        type='number'
        value={userWorkMinutes}
        onChange={handleWorkMinutesChange}
      />
      <input
        type='number'
        value={userBreakMinutes}
        onChange={handleBreakMinutesChange}
      />
      <h2>{displayTime}</h2>
      <button className='start-button' onClick={startTimer}>Start</button>
      <button className='stop-button' onClick={stopTimer}>Stop</button>
      <button className='reset-button' onClick={resetTimer}>Reset</button>
      <h3>Work Sessions: {workSessions}</h3>
    </div>
  );
}

export default App;
