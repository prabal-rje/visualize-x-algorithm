import { useEffect, useState } from 'react';
import { ATTRIBUTION } from '../../data/attribution';
import { useMLStore } from '../../stores/ml';

const INIT_STEPS = [
  { id: 'neural', label: 'Establishing neural link...' },
  { id: 'model', label: 'Loading semantic processor (22.4 MB)...' },
  { id: 'embeddings', label: 'Calibrating embedding matrices...' },
  { id: 'filters', label: 'Initializing filter cascade...' },
  { id: 'scoring', label: 'Connecting to scoring transformers...' }
];

function formatElapsedTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes > 0) {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
  return `${secs}s`;
}

export default function BIOSLoading() {
  const progress = useMLStore((state) => state.progress);
  const currentStep = useMLStore((state) => state.currentStep);
  const startTime = useMLStore((state) => state.startTime);
  const [elapsed, setElapsed] = useState(0);

  // Update elapsed time every 100ms for smooth display
  useEffect(() => {
    if (!startTime) return;

    const updateElapsed = () => {
      setElapsed(Date.now() - startTime);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 100);
    return () => clearInterval(interval);
  }, [startTime]);

  const progressPercent = Math.round(progress * 100);

  const getStepStatus = (index: number) => {
    const stepProgress = (index + 1) / INIT_STEPS.length;
    if (progress >= stepProgress) return '[ OK ]';
    if (progress >= stepProgress - 0.2) return '[....]';
    return '[PENDING]';
  };

  return (
    <section
      className="flex w-full max-w-2xl flex-col gap-3 border border-crt-line bg-crt-black p-panel text-sm text-crt-ink shadow-[inset_0_0_30px_rgba(51,255,51,0.08),_0_0_24px_rgba(51,255,51,0.15)] sm:gap-4 sm:text-base"
      data-testid="bios-loading"
      data-system="bios"
    >
      <header className="text-center">
        <div className="text-base tracking-[0.1em] text-crt-amber text-glow-amber sm:text-xl">
          X-ALGORITHM VISUALIZER v1.0
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

      <div className="mt-1 sm:mt-2">
        <div className="tracking-[0.1em] text-crt-ink text-glow-green">
          SYSTEM INITIALIZATION
        </div>
        <div className="h-px w-full bg-gradient-to-r from-crt-ink/50 via-crt-ink/30 to-crt-ink/50" />
      </div>

      <div className="flex flex-col gap-0.5 text-xs sm:gap-1 sm:text-sm">
        {INIT_STEPS.map((step, index) => (
          <div key={step.id} className="flex justify-between gap-2 text-crt-ink">
            <span className="truncate">&gt; {step.label}</span>
            <span className="shrink-0 font-bold text-crt-amber">
              {getStepStatus(index)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-1 sm:mt-2">
        <div className="flex items-center justify-between gap-2 text-xs sm:gap-4 sm:text-sm">
          <div
            className="relative h-4 flex-1 overflow-hidden rounded-sm border border-crt-cyan/50 bg-crt-black sm:h-5"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="absolute inset-y-0 left-0 bg-crt-cyan/80 transition-[width] duration-200"
              style={{ width: `${progressPercent}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center font-mono text-xs tracking-wider text-crt-cyan text-glow-cyan">
              {progressPercent}%
            </span>
          </div>
          <div className="shrink-0 font-mono text-crt-amber text-glow-amber" data-testid="elapsed-timer">
            [{formatElapsedTime(elapsed)}]
          </div>
        </div>
        {currentStep && (
          <div className="mt-1 truncate text-xs text-crt-ink/80 sm:text-sm">{currentStep}</div>
        )}
      </div>

      <div className="mt-2 sm:mt-4">
        <div className="h-px w-full bg-gradient-to-r from-crt-ink/30 via-crt-ink/20 to-crt-ink/30" />
        <div className="mt-2 text-xs text-crt-amber/80 text-glow-amber sm:text-sm">
          [TIP] This visualizer uses real ML models to compute real scores.
        </div>
        <div className="text-xs text-crt-amber/80 text-glow-amber sm:text-sm">
          The download is worth it. Trust us.
        </div>
      </div>
    </section>
  );
}
