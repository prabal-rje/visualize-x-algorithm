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
  const progressBlocks = Math.round(progressPercent / 10);
  const progressBar = `${'█'.repeat(progressBlocks)}${'░'.repeat(10 - progressBlocks)}`;

  const getStepStatus = (index: number) => {
    const stepProgress = (index + 1) / INIT_STEPS.length;
    if (progress >= stepProgress) return '[ OK ]';
    if (progress >= stepProgress - 0.2) return '[....]';
    return '[PENDING]';
  };

  return (
    <section
      className="crt-panel flex w-full max-w-2xl flex-col gap-4 p-panel sm:gap-5"
      data-testid="bios-loading"
      data-system="bios"
    >
      <header className="text-center">
        <h1 className="crt-h2 text-crt-amber text-glow-amber">X-ALGORITHM VISUALIZER v1.0</h1>
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

      <div>
        <h2 className="crt-h3 text-glow-green">SYSTEM INITIALIZATION</h2>
        <div className="crt-divider-glow mt-2" />
      </div>

      <div className="flex flex-col gap-1">
        {INIT_STEPS.map((step, index) => (
          <div key={step.id} className="crt-body flex justify-between gap-2">
            <span className="truncate">&gt; {step.label}</span>
            <span className="crt-badge-amber shrink-0 !p-0 !border-0 !bg-transparent">
              {getStepStatus(index)}
            </span>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between gap-3">
          <div
            className="crt-progress relative flex-1"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="absolute inset-y-0 left-0 bg-crt-cyan/80 transition-[width] duration-200"
              style={{ width: `${progressPercent}%` }}
            />
            <span className="crt-progress-text text-crt-cyan text-glow-cyan">
              {progressBar} {progressPercent}%
            </span>
          </div>
          <div className="crt-caption text-crt-amber text-glow-amber" data-testid="elapsed-timer">
            [{formatElapsedTime(elapsed)}]
          </div>
        </div>
        {currentStep && (
          <p className="crt-caption mt-2 truncate opacity-80">{currentStep}</p>
        )}
      </div>

      <div>
        <div className="crt-divider" />
        <p className="crt-body mt-3 text-crt-amber/90 text-glow-amber">
          [TIP] This visualizer uses real ML models to compute real scores.
        </p>
        <p className="crt-body text-crt-amber/90 text-glow-amber">
          The download is worth it. Trust us.
        </p>
      </div>
    </section>
  );
}
