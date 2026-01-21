import { useEffect, useMemo, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import styles from '../../styles/crt.module.css';

const DEFAULT_PHOSPHOR_PERSISTENCE_MS = 800;

const parsePhosphorPersistence = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return DEFAULT_PHOSPHOR_PERSISTENCE_MS;
  }
  const numeric = Number.parseFloat(trimmed);
  return Number.isFinite(numeric) ? numeric : DEFAULT_PHOSPHOR_PERSISTENCE_MS;
};

export default function PhosphorText({ children }: PropsWithChildren) {
  const [trailText, setTrailText] = useState<string | null>(null);
  const previousTextRef = useRef<string>('');
  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const textValue =
    typeof children === 'string' || typeof children === 'number'
      ? String(children)
      : '';
  const persistenceMs = useMemo(() => {
    if (!wrapperRef.current) {
      return DEFAULT_PHOSPHOR_PERSISTENCE_MS;
    }
    const computed = getComputedStyle(wrapperRef.current);
    return parsePhosphorPersistence(
      computed.getPropertyValue('--phosphor-persistence')
    );
  }, [textValue]);

  useEffect(() => {
    if (previousTextRef.current === textValue) {
      return undefined;
    }

    const previousText = previousTextRef.current;
    previousTextRef.current = textValue;

    if (!previousText) {
      setTrailText(null);
      return undefined;
    }

    setTrailText(previousText);
    const timeout = window.setTimeout(() => {
      setTrailText(null);
    }, persistenceMs);

    return () => window.clearTimeout(timeout);
  }, [textValue, persistenceMs]);

  return (
    <span className={styles.phosphorWrapper} ref={wrapperRef}>
      {trailText ? (
        <span
          className={styles.phosphorTrail}
          data-testid="phosphor-trail"
          aria-hidden="true"
        >
          {trailText}
        </span>
      ) : null}
      <span className={styles.phosphorText}>{children}</span>
    </span>
  );
}
