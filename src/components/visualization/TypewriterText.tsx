import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/typewriter.module.css';
import { playTypewriterKey } from '../../audio/engine';

type TypewriterTextProps = {
  /** The text to type out */
  text: string;
  /** Whether to start typing */
  started: boolean;
  /** Typing speed in ms per character (default: 50) */
  speed?: number;
  /** Variance in typing speed (ms) for more organic cadence */
  speedVariance?: number;
  /** Whether to show cursor */
  showCursor?: boolean;
  /** Whether to hide cursor when complete */
  hideCursorOnComplete?: boolean;
  /** Called when typing is complete */
  onComplete?: () => void;
  /** Show full text immediately (skip animation) */
  instant?: boolean;
  /** Additional CSS class */
  className?: string;
};

export default function TypewriterText({
  text,
  started,
  speed = 50,
  speedVariance = 0,
  showCursor = false,
  hideCursorOnComplete = false,
  onComplete,
  instant = false,
  className = ''
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const onCompleteRef = useRef(onComplete);

  // Keep callback ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!started) {
      setDisplayedText('');
      setIsComplete(false);
      return;
    }

    if (instant) {
      setDisplayedText(text);
      setIsComplete(true);
      onCompleteRef.current?.();
      return;
    }

    let currentIndex = 0;
    setDisplayedText('');
    setIsComplete(false);

    const variance = Math.max(0, speedVariance);
    const minDelay = Math.max(10, speed - variance);
    const maxDelay = speed + variance;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const getDelay = () => {
      if (variance === 0) return speed;
      const range = maxDelay - minDelay;
      return Math.round(minDelay + Math.random() * range);
    };

    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          // Only play sound every ~4th character (25% chance)
          if (Math.random() < 0.25) {
            void playTypewriterKey();
          }
          currentIndex += 1;
          scheduleNext();
        } else {
          setIsComplete(true);
          onCompleteRef.current?.();
        }
      }, getDelay());
    };

    scheduleNext();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [text, started, speed, speedVariance, instant]);

  const shouldShowCursor = showCursor && (!hideCursorOnComplete || !isComplete);

  return (
    <span
      data-testid="typewriter-text"
      className={`${styles.typewriter} ${className}`}
    >
      {displayedText}
      {shouldShowCursor && (
        <span data-testid="typewriter-cursor" className={styles.cursor}>
          _
        </span>
      )}
    </span>
  );
}
