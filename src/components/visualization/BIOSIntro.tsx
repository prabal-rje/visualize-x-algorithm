import { useEffect, useState } from 'react';
import { ATTRIBUTION } from '../../data/attribution';

const INTRO_LINES = [
  '> YOUR TWEET. REAL MATH.',
  '',
  'Type anything. Pick your persona.',
  'Watch YOUR words get tokenized, embedded, and scored—live.',
  '',
  '!POWERED BY REAL ML MODELS!',
  'Every number changes based on what YOU write.'
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
      className="flex w-full flex-col gap-3 border border-crt-line bg-crt-black p-panel text-sm text-crt-ink shadow-[inset_0_0_30px_rgba(51,255,51,0.08),_0_0_24px_rgba(51,255,51,0.15)] sm:max-w-2xl sm:gap-4 sm:text-base"
      data-testid="bios-intro"
      data-system="bios"
    >
      <header className="text-center">
        <div className="text-base tracking-[0.1em] text-crt-amber text-glow-amber sm:text-xl">
          THE ANATOMY OF VIRALITY
        </div>
        <div className="text-xs text-crt-ink/70 sm:text-sm">
          (c) 2026{' '}
          <a
            href={ATTRIBUTION.links.twitter}
            target="_blank"
            rel="noreferrer"
            className="text-crt-amber/80 transition hover:text-crt-amber hover:text-glow-amber"
          >
            @prabal_
          </a>
        </div>
      </header>

      <div className="h-px w-full bg-gradient-to-r from-crt-ink/50 via-crt-ink/30 to-crt-ink/50" />

      {/* Intro text with typewriter effect */}
      <div className="flex min-h-[110px] flex-col gap-1 text-xs sm:min-h-[140px] sm:text-sm">
        {INTRO_LINES.slice(0, visibleLines).map((line, index) => (
          <div
            key={index}
            className={
              line === ''
                ? 'h-3'
                : line.startsWith('>')
                  ? 'font-bold text-crt-cyan text-glow-cyan'
                  : line.startsWith('!')
                    ? 'font-bold text-red-500 animate-pulse'
                    : 'text-crt-ink/90'
            }
          >
            {line}
          </div>
        ))}
        {visibleLines < INTRO_LINES.length && (
          <span className="inline-block w-2 animate-pulse text-crt-ink">█</span>
        )}
      </div>

      <div className="h-px w-full bg-gradient-to-r from-crt-ink/30 via-crt-ink/20 to-crt-ink/30" />

      {/* Start button */}
      <div className="flex justify-center">
        {showButton ? (
          <button
            type="button"
            className="crt-button px-10 py-3 text-sm tracking-[0.2em] animate-[fadeIn_0.3s_ease-out]"
            onClick={onStart}
          >
            START SIMULATION
          </button>
        ) : (
          <div className="h-12" />
        )}
      </div>

      <div className="text-center text-xs text-crt-ink/50">
        Press ENTER or click the button above to begin
      </div>
    </section>
  );
}
