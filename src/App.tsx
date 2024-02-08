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
  <circle cx="16" cy="16" r="14" stroke="${color}" stroke-width="6" fill="none" stroke-dasharray="${
    progress * 100
  }, 100" transform="rotate(-90 16 16)" />
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

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [displayTime, setDisplayTime] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [workSessions, setWorkSessions] = useState(0);
  const [userWorkMinutes, setUserWorkMinutes] = useState(25);
  const [userBreakMinutes, setUserBreakMinutes] = useState(5);
  const [totalSeconds, setTotalSeconds] = useState(userWorkMinutes * 60);
  const [textColor, setTextColor] = useState('#000');
  const [sessionCounter, setSessionCounter] = useState(0);
  const defaultIframeHtml = `<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1035841942&color=%23545e81&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/lofi_girl" title="Lofi Girl" target="_blank" style="color: #cccccc; text-decoration: none;">Lofi Girl</a> · <a href="https://soundcloud.com/lofi_girl/4-am-studysession" title="4 A.M Study Session 📚 - [lofi hip hop/chill beats]" target="_blank" style="color: #cccccc; text-decoration: none;">4 A.M Study Session 📚 - [lofi hip hop/chill beats]</a></div>`;
  const [iframeHtml, setIframeHtml] = useState(defaultIframeHtml);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIframeHtml(event.target.value);
  };

  const switchTimer = () => {
    setIsWorkTime((prevIsWorkTime) => {
      switchGreadients();
      const newIsWorkTime = !prevIsWorkTime;
      const newMinutes = newIsWorkTime ? userWorkMinutes : userBreakMinutes;
      setMinutes(newMinutes);
      setTotalSeconds(newMinutes * 60);
      return newIsWorkTime;
    });
    setSessionCounter((prevCounter) => prevCounter + 1);
    playSound();
    if (sessionCounter === 2) {
      setWorkSessions((prevSessions) => prevSessions + 1);
      setSessionCounter(0);
    }
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

  const { minutes, seconds, setMinutes, setSeconds, phase, setPhase } =
    useTimer(
      userWorkMinutes,
      userBreakMinutes,
      isRunning,
      completeWorkSession,
      switchTimer
    );

  const audio = new Audio(beepingSound);
  const circleColor = phase === 'work' ? 'green' : 'yellow';

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
    setUserBreakMinutes(userBreakMinutes);
    setPhase('work');
    setSeconds(0);
    setIsRunning(false);
  };

  const switchGreadients = () => {
    let startColor = '#4ADEDE';
    let endColor = '#5ADAAE';
    if (phase === 'work') {
      startColor = '#5ADAAE';
      endColor = '#4ADEDE';
    }
    const app = document.querySelector('.App') as HTMLElement;
    app.style.setProperty('--color-start', startColor);
    app.style.setProperty('--color-end', endColor);
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
      if (minutes > 0) {
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
    let progress: number;
    const faviconColor = phase === 'work' ? 'red' : 'yellow';
    if (phase === 'work') {
      progress =
        (userWorkMinutes * 60 - (minutes * 60 + seconds)) /
        (userWorkMinutes * 60);
    } else {
      progress =
        (userBreakMinutes * 60 - (minutes * 60 + seconds)) /
        (userBreakMinutes * 60);
    }

    // const countdownElement = document.querySelector(
    //   '.countdown'
    // ) as HTMLElement;
    // if (countdownElement) {
    //   countdownElement.style.animationDuration = `${userWorkMinutes * 60}s`;
    // }
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
    app.style.setProperty('--progress', `${progress * 100}%`);

    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, [minutes, seconds, totalSeconds, userWorkMinutes, phase]);

  return (
    <div className='App'>
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

      {/* <h3>Pomodoro Timer</h3> */}

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
      <div
        style={{ position: 'absolute', zIndex: -1 }}
        dangerouslySetInnerHTML={{ __html: iframeHtml }}
      />
      <button onClick={() => setShowSettings(!showSettings)}>
        {showSettings ? 'Hide Settings' : 'Show Settings'}
      </button>
      {showSettings && (
        <>
          <div>
            <input
              type='text'
              onChange={handleInputChange}
              placeholder='Enter new iframe HTML'
            />
          </div>
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
        </>
      )}
    </div>
  );
}

export default App;
