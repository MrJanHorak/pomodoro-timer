import { useState, useEffect } from 'react';
import './App.css';

// assets
import beepingSound from './assets/sounds/Quick-beep-sound-effect.mp3';

// custom hooks
import { useTimer } from './customHooks/useTimer.ts';

// Function to create a dynamic SVG
const createProgressSVG = (progress: number, color: string) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="14" stroke="#999" stroke-width="6" fill="none" />
  <circle cx="16" cy="16" r="14" stroke="${color}" stroke-width="6" fill="none" stroke-dasharray="${progress * 100}, 100" transform="rotate(-90 16 16)" />
</svg>`;
return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};
// Function to set the favicon
const setFavicon = (url: string) => {
  const link =
    (document.querySelector("link[rel*='icon']") as HTMLLinkElement) ||
    document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = url;
  document.getElementsByTagName('head')[0].appendChild(link);
};

// function createWaveKeyframes(progress) {
//   return `
//     @keyframes wave {
//       0% {
//         background-position: 0% ${progress * 100}%;
//       }
//       50% {
//         background-position: 100% ${progress * 100}%;
//       }
//       100% {
//         background-position: 0% ${progress * 100}%;
//       }
//     }
//   `;
// }

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
  const [backgroundStyle, setBackgroundStyle] = useState({});
  const [textColor, setTextColor] = useState('#000');

  const switchTimer = () => {
    setIsWorkTime(!isWorkTime);
    const newMinutes = isWorkTime ? userBreakMinutes : userWorkMinutes;
    setMinutes(newMinutes);
    setTotalSeconds(newMinutes * 60);
    playSound();
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

  const { minutes, seconds, setMinutes, setSeconds, phase } = useTimer(
    userWorkMinutes, userBreakMinutes,
    isRunning,
    completeWorkSession
  );

  const audio = new Audio(beepingSound);

  const playSound = () => {
    audio.play();
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const setTimer = (minutes: number) => {
    setMinutes(minutes);
    setTotalSeconds(minutes * 60);
    setUserWorkMinutes(minutes);
    setSeconds(0);
    setIsRunning(false);
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

  const addMinuteToBreak = () => {
    if (!isRunning) {
      setUserBreakMinutes((prevMinutes) => prevMinutes + 1);
    }
  };

  const subtractMinuteFromBreak = () => {
    if (!isRunning) {
      if (userBreakMinutes > 0) {
        setUserBreakMinutes((prevMinutes) => prevMinutes - 1);
      }
    }
  };

  useEffect(() => {
    const circleColor = phase === 'work' ? 'green' : 'yellow';
    const faviconColor = phase === 'work' ? 'red' : 'yellow';
    // const progress = (totalSeconds - minutes * 60 - seconds) / totalSeconds;
    // const progress = (totalSeconds - minutes * 60 - seconds) / totalSeconds;
    const progress =
      (userWorkMinutes * 60 - (minutes * 60 + seconds)) /
      (userWorkMinutes * 60);
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

    document.title = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')} - Pomodoro Timer`;

    const svg = createProgressSVG(progress, faviconColor);
    setFavicon(svg);

    const app = document.querySelector('.App') as HTMLElement;

    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .App::before {
        background: linear-gradient(to top, #4ab9de ${
          progress * 100
        }%, #4ADEDE ${progress * 100}%);
        opacity: 1;
      }
    `;

    app.style.setProperty('--timer-duration', `${userWorkMinutes * 60}s`);
    app.style.setProperty('--color-start', '#000000');
    app.style.setProperty('--color-end', '#4ADEDE');
    app.style.setProperty('--progress', `${progress * 100}%`);

    // Append the style element to the document head
    document.head.appendChild(styleElement);

    // const app = document.querySelector('.App') as HTMLElement;
    // if (app) {
    //   app.style.setProperty('--color-start', '#4ab9de');
    //   app.style.setProperty('--color-end', '#4ADEDE');
    //   app.style.setProperty('--progress', `${progress * 100}%`);
    // }

    return () => {
      document.head.removeChild(styleElement);
    };
  }, [minutes, seconds, totalSeconds, userWorkMinutes]);

  return (
    <div className='App' style={{ animation: 'wave 3s ease infinite' }}>
      <h1>Pomodoro Timer</h1>

      {/* <label htmlFor='progress'>Progress</label>
      <progress
        value={(totalSeconds - minutes * 60 - seconds) / totalSeconds}
        max='1'
      /> */}

      <div className='timer-container'>
        <div className='circle-container'>
          <div className='button-container' style={{ color: textColor }}>
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
            className={`countdown-circle ${isRunning ? 'countdown' : ''}`}
          ></div>
          <div className='time-display'>{displayTime}</div>
        </div>
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
      <label htmlFor='work-minutes'>Work Minutes</label>
      <div className='set-work-minutes-container'>
        <button className={'plus-minus'} onClick={subtractMinute}>
          -
        </button>

        <input
          type='number'
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
          type='number'
          value={userBreakMinutes}
          onChange={handleBreakMinutesChange}
        />
        <button className={'plus-minus'} onClick={addMinuteToBreak}>
          +
        </button>
      </div>
    </div>
  );
}

export default App;
