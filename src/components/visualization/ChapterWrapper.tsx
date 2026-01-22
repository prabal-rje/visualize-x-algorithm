import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';
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
  const chapterBorder: Record<number, string> = {
    0: '51 255 51',
    1: '0 170 255',
    2: '255 176 0',
    3: '255 100 100',
    4: '180 100 255',
    5: '255 140 0'
  };
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
      className="group relative rounded-panel border border-[color:rgb(var(--chapter-border)/0.5)] bg-crt-panel-deep/80 p-panel text-crt-ink shadow-crt-inset data-[active=false]:pointer-events-none data-[active=false]:opacity-30 max-sm:border-0 max-sm:rounded-none max-sm:px-0 max-sm:py-3 max-sm:shadow-none max-sm:bg-transparent"
      data-testid={`chapter-wrapper-${chapterIndex}`}
      data-active={isActive}
      data-in-view={inView}
      data-chapter={chapterIndex}
      data-system="chapter"
      style={
        {
          '--chapter-border': chapterBorder[chapterIndex]
        } as React.CSSProperties
      }
    >
      {title && (
        <h2 className="mb-4 font-display text-[18px] uppercase tracking-[0.2em] text-crt-ink text-glow-green">
          {title}
        </h2>
      )}
      <div className="relative group-data-[active=true]:animate-chapter-enter">
        {children}
      </div>
    </div>
  );
}
