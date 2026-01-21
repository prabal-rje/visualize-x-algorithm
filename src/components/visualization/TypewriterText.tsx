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

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        void playTypewriterKey();
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, started, speed, instant]);

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
