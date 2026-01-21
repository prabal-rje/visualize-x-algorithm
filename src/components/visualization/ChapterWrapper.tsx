import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';
import styles from '../../styles/chapter-wrapper.module.css';
import { playChapterTransition } from '../../audio/engine';

type ChapterWrapperProps = {
  /** Chapter index (0-based) */
  chapterIndex: number;
  /** Whether this chapter is currently active */
  isActive: boolean;
  /** Optional chapter title to display */
  title?: string;
  /** Chapter content */
  children: ReactNode;
};

export default function ChapterWrapper({
  chapterIndex,
  isActive,
  title,
  children
}: ChapterWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wasActiveRef = useRef(isActive);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.25 }
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) {
      return;
    }

    if (!inView) {
      return;
    }

    // Enter animation when becoming active
    if (isActive && !wasActiveRef.current) {
      gsap.fromTo(
        wrapper,
        {
          opacity: 0,
          y: 20,
          scale: 0.98
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        }
      );
      void playChapterTransition();
    }

    // Exit animation when becoming inactive
    if (!isActive && wasActiveRef.current) {
      gsap.to(wrapper, {
        opacity: 0.3,
        y: -10,
        duration: 0.3,
        ease: 'power2.in'
      });
    }

    // Initial state when mounting as active
    if (isActive && wasActiveRef.current === isActive) {
      gsap.fromTo(
        wrapper,
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out'
        }
      );
    }

    wasActiveRef.current = isActive;
  }, [inView, isActive]);

  return (
    <div
      ref={wrapperRef}
      className={styles.chapter}
      data-testid={`chapter-wrapper-${chapterIndex}`}
      data-active={isActive}
      data-in-view={inView}
      data-chapter={chapterIndex}
    >
      {title && <h2 className={styles.title}>{title}</h2>}
      <div className={styles.content}>{children}</div>
    </div>
  );
}
