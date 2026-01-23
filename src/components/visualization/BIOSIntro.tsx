import { useEffect, useState } from 'react';
import { ATTRIBUTION } from '../../data/attribution';

const INTRO_LINES = [
  '> UNDERSTAND X\'s ALGORITHM <',
  'Write a tweet. Pick a persona.',
  'Watch it get tokenized, embedded, filtered, and ranked—live.',
  '',
  '> POWERED BY REAL ML MODELS <',
  'Every number computed from YOUR actual words.'
];

type BIOSIntroProps = {
  onStart: () => void;
};

export default function BIOSIntro({ onStart }: BIOSIntroProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showButton, setShowButton] = useState(false);

  // Typewriter effect for intro lines
  useEffect(() => {
    if (visibleLines >= INTRO_LINES.length) {
      // Show button after all lines are visible
      const timer = setTimeout(() => setShowButton(true), 300);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setVisibleLines((prev) => prev + 1);
    }, 80);
    return () => clearTimeout(timer);
  }, [visibleLines]);

  return (
    <section
      className="crt-panel flex w-full flex-col gap-4 p-panel sm:max-w-2xl sm:gap-5"
      data-testid="bios-intro"
      data-system="bios"
    >
      <header className="text-center">
        <h1 className="crt-h2 text-crt-amber text-glow-amber">X ALGORITHM VISUALIZER</h1>
        <p className="crt-h4 mt-2 text-crt-amber">
          (c) 2026{' '}
          <a
            href={ATTRIBUTION.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="crt-link"
          >
            @prabal_
          </a>
        </p>
      </header>

      <div className="crt-divider-glow" />

      {/* Intro text with typewriter effect */}
      <div className="flex min-h-[120px] flex-col gap-1.5 text-center sm:min-h-[150px]">
        {INTRO_LINES.slice(0, visibleLines).map((line, index) => (
          <div
            key={index}
            className={
              line === ''
                ? 'h-3'
                : line.startsWith('>')
                  ? 'crt-h3 text-crt-cyan text-glow-cyan'
                  : 'crt-body'
            }
          >
            {line}
          </div>
        ))}
        {visibleLines < INTRO_LINES.length && (
          <span className="inline-block w-2 animate-pulse text-crt-ink">█</span>
        )}
      </div>

      <div className="crt-divider" />

      {/* Start button */}
      <div className="flex justify-center">
        {showButton ? (
          <button
            type="button"
            className="crt-button-primary animate-[fadeIn_0.3s_ease-out]"
            onClick={onStart}
          >
            START SIMULATION
          </button>
        ) : (
          <div className="h-12" />
        )}
      </div>

    </section>
  );
}
