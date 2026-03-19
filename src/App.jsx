import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import twitter from './images/x.png';
import yt from './images/yt.png';
import discord from './images/discord.png';
import cover from './images/cover.png';
import stop from './song/stopplayin.mp3';
import bg from './videos/car.mp4';
import git from './images/git2.png';

const profileImage =
  'https://yt3.googleusercontent.com/4v-1SD_k5hJwNwbwc1YVyXNysMKYfgL91wY_lnkzkJUd9lsVZVpLhmcEee7acekrK-1456FJNQ=s160-c-k-c0x00ffffff-no-rj';

const bioText = 'MCPVP and more';
const trailCount = 6;

const socialLinks = [
  {
    href: 'https://x.com/AaA_i_venix_cle',
    icon: twitter,
    label: 'Twitter',
    className: 'social-x',
  },
  {
    href: 'https://github.com/ARON-JP',
    icon: git,
    label: 'GitHub',
    className: 'social-github',
  },
  {
    href: 'https://www.youtube.com/@kqlem',
    icon: yt,
    label: 'YouTube',
    className: 'social-youtube',
  },
  {
    href: 'https://discord.com/users/959090707426066474',
    icon: discord,
    label: 'Discord',
    className: 'social-discord',
  },
];

function AudioControlIcon({ type }) {
  if (type === 'play') {
    return (
      <svg viewBox='0 0 24 24' aria-hidden='true' className='audio-icon'>
        <path d='M8 6v12l10-6z' fill='currentColor' />
      </svg>
    );
  }

  if (type === 'pause') {
    return (
      <svg viewBox='0 0 24 24' aria-hidden='true' className='audio-icon'>
        <path d='M7 6h4v12H7zm6 0h4v12h-4z' fill='currentColor' />
      </svg>
    );
  }

  if (type === 'stop') {
    return (
      <svg viewBox='0 0 24 24' aria-hidden='true' className='audio-icon'>
        <path d='M7 7h10v10H7z' fill='currentColor' />
      </svg>
    );
  }

  if (type === 'restart') {
    return (
      <svg viewBox='0 0 24 24' aria-hidden='true' className='audio-icon'>
        <path
          d='M12 5a7 7 0 1 1-6.18 10.29l1.76-.96A5 5 0 1 0 7 9H4V4l1.83 1.83A8.96 8.96 0 0 1 12 5z'
          fill='currentColor'
        />
      </svg>
    );
  }

  return (
    <svg viewBox='0 0 24 24' aria-hidden='true' className='audio-icon'>
      <path
        d='M14 5.23v2.06a5 5 0 0 1 0 9.42v2.06a7 7 0 0 0 0-13.54zM5 9v6h4l5 4V5l-5 4zm11.5 3a2.5 2.5 0 0 0-1.5-2.29v4.58A2.5 2.5 0 0 0 16.5 12z'
        fill='currentColor'
      />
    </svg>
  );
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function App() {
  const audioRef = useRef(null);
  const trailRefs = useRef([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [bio, setBio] = useState('');
  const [entered, setEntered] = useState(false);
  const [typingIndex, setTypingIndex] = useState(0);
  const [isTypingForward, setIsTypingForward] = useState(true);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [clickBursts, setClickBursts] = useState([]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (isTypingForward) {
        if (typingIndex < bioText.length) {
          setBio((previous) => previous + bioText.charAt(typingIndex));
          setTypingIndex((previous) => previous + 1);
          return;
        }

        setIsTypingForward(false);
        return;
      }

      if (typingIndex > 0) {
        setBio((previous) => previous.slice(0, -1));
        setTypingIndex((previous) => previous - 1);
        return;
      }

      setIsTypingForward(true);
    }, isTypingForward ? 55 : 35);

    return () => window.clearTimeout(timer);
  }, [isTypingForward, typingIndex]);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return undefined;
    }

    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration || 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleVolumeChange = () => {
      setIsMuted(audioElement.muted);
    };

    const handleEnded = () => {
      audioElement.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
    };

    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('volumechange', handleVolumeChange);
    audioElement.addEventListener('ended', handleEnded);

    handleLoadedMetadata();
    handleTimeUpdate();
    handleVolumeChange();

    return () => {
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('volumechange', handleVolumeChange);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    const trailPoints = Array.from({ length: trailCount }, () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }));

    let mouseX = trailPoints[0].x;
    let mouseY = trailPoints[0].y;
    let animationFrameId = 0;

    const spawnBurst = (x, y) => {
      const burstId = `${Date.now()}-${Math.random()}`;
      const hue = Math.floor(Math.random() * 360);

      setClickBursts((previous) => [...previous, { id: burstId, x, y, hue }]);

      window.setTimeout(() => {
        setClickBursts((previous) => previous.filter((burst) => burst.id !== burstId));
      }, 700);
    };

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseDown = (event) => {
      spawnBurst(event.clientX, event.clientY);
    };

    const animateTrail = () => {
      trailPoints[0].x += (mouseX - trailPoints[0].x) * 0.35;
      trailPoints[0].y += (mouseY - trailPoints[0].y) * 0.35;

      for (let index = 1; index < trailPoints.length; index += 1) {
        trailPoints[index].x += (trailPoints[index - 1].x - trailPoints[index].x) * 0.28;
        trailPoints[index].y += (trailPoints[index - 1].y - trailPoints[index].y) * 0.28;
      }

      trailPoints.forEach((point, index) => {
        const element = trailRefs.current[index];

        if (!element) {
          return;
        }

        const scale = 1 - index * 0.1;
        element.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) scale(${scale})`;
        element.style.opacity = `${0.36 - index * 0.045}`;
      });

      animationFrameId = window.requestAnimationFrame(animateTrail);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    animationFrameId = window.requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const startAudio = () => {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    audioElement.volume = 1;
    audioElement
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => console.error('Audio playback failed:', error));
  };

  const handleOverlayClick = () => {
    setShowOverlay(false);
    setEntered(true);
    startAudio();
  };

  const handlePlayPause = () => {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    if (audioElement.paused) {
      audioElement
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => console.error('Audio playback failed:', error));
      return;
    }

    audioElement.pause();
  };

  const handleStop = () => {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    audioElement.pause();
    audioElement.currentTime = 0;
    setCurrentTime(0);
  };

  const handleRestart = () => {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    audioElement.currentTime = 0;
    setCurrentTime(0);
    audioElement
      .play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => console.error('Audio playback failed:', error));
  };

  const handleMuteToggle = () => {
    const audioElement = audioRef.current;

    if (!audioElement) {
      return;
    }

    audioElement.muted = !audioElement.muted;
    setIsMuted(audioElement.muted);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className='app-container'>
      <video autoPlay loop muted className='video-background'>
        <source src={bg} type='video/mp4' />
        Your browser does not support the video tag.
      </video>
      <div className='background-shade' aria-hidden='true' />

      <div className='cursor-aura' style={{ transform: `translate3d(${cursorPosition.x}px, ${cursorPosition.y}px, 0)` }} />
      <div className='cursor-core' style={{ transform: `translate3d(${cursorPosition.x}px, ${cursorPosition.y}px, 0)` }} />
      {Array.from({ length: trailCount }).map((_, index) => (
        <div
          key={`trail-${index}`}
          ref={(element) => {
            trailRefs.current[index] = element;
          }}
          className='cursor-trail'
        />
      ))}

      <div className='particle-layer' aria-hidden='true'>
        {clickBursts.map((burst) => (
          <div
            key={burst.id}
            className='click-burst'
            style={{
              left: burst.x,
              top: burst.y,
              '--burst-hue': burst.hue,
            }}
          >
            {Array.from({ length: 10 }).map((_, index) => (
              <span
                key={`${burst.id}-${index}`}
                className='click-particle'
                style={{
                  '--angle': `${index * 36}deg`,
                  '--distance': `${28 + (index % 3) * 14}px`,
                  '--delay': `${index * 14}ms`,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {showOverlay && (
        <div className='overlay' onClick={handleOverlayClick}>
          <p className='click'>Click Anywhere</p>
        </div>
      )}

      <div className={`main-container ${entered ? 'entered' : ''}`}>
        <img src={profileImage} className='pfp' alt='Profile Picture' />
        <div className='info'>
          <h1 className='name'>{'\u3042\u308d\u3093'}</h1>
          <p className='bio'>{bio}</p>
        </div>

        <div className='links'>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target='_blank'
              rel='noopener noreferrer'
              className={`social-link ${link.className}`}
              aria-label={link.label}
            >
              <img src={link.icon} className='social-icon' alt={link.label} />
            </a>
          ))}
        </div>

        <div className='div1' />

        <div className='song'>
          <a
            href='https://soundcloud.com/trapdailysounds/glokk40spaz-sg-lul-ki-stop-playin-prod-by-khroam'
            target='_blank'
            rel='noopener noreferrer'
            className='song-cover-link'
          >
            <img src={cover} className='songcover' alt='Song cover art' />
          </a>

          <div className='song-content'>
            <div className='songinfo'>
              <p className='songtitle'>{'\u9192\u3081\u306a\u3044\u5922\u306e\u7720\u308a\u59eb'}</p>
              <p className='artist'>{'\u306a\u306a\u3072\u3089'}</p>
            </div>

            <div className='audio-player-shell'>
              <div className='audio-progress-section'>
                <span className='audio-time'>{formatTime(currentTime)}</span>
                <div className='audio-progress-container'>
                  <div className='progress-bar-container'>
                    <div className='progress-bar' style={{ width: `${progressPercentage}%` }} />
                  </div>
                </div>
                <span className='audio-time'>{formatTime(duration)}</span>
              </div>

              <div className='audio-main'>
                <div className='audio-additional-controls'>
                  <button type='button' className='audio-button audio-button-secondary' onClick={handleRestart} aria-label='Restart'>
                    <AudioControlIcon type='restart' />
                  </button>
                  <button type='button' className='audio-button audio-button-secondary' onClick={handleStop} aria-label='Stop'>
                    <AudioControlIcon type='stop' />
                  </button>
                </div>

                <div className='audio-main-controls'>
                  <button type='button' className='audio-button audio-button-primary' onClick={handlePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
                    <AudioControlIcon type={isPlaying ? 'pause' : 'play'} />
                  </button>
                </div>

                <div className='audio-volume-controls'>
                  <button type='button' className='audio-button audio-button-secondary' onClick={handleMuteToggle} aria-label={isMuted ? 'Unmute' : 'Mute'}>
                    <AudioControlIcon type='mute' />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <audio ref={audioRef} src={stop} preload='metadata' />
        </div>
      </div>
    </div>
  );
}

export default App;
