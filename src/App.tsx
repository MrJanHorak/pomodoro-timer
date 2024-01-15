import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [displayTime, setDisplayTime] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [workSessions, setWorkSessions] = useState(0);

  const startTimer = () => setIsRunning(true);
  const stopTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setMinutes(25);
    setSeconds(0);
    setIsRunning(false);
  };
  const switchTimer = () => setIsWorkTime(!isWorkTime);

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
      <h2>{displayTime}</h2>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
      <button onClick={resetTimer}>Reset</button>
      <h3>Work Sessions: {workSessions}</h3>
    </div>
  );
}

export default App;
