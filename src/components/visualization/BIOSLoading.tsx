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
  const barWidth = Math.round(progress * 40);
  const barFill = '\u2588'.repeat(barWidth);
  const barEmpty = '\u2591'.repeat(40 - barWidth);

  const getStepStatus = (index: number) => {
    const stepProgress = (index + 1) / INIT_STEPS.length;
    if (progress >= stepProgress) return '[ OK ]';
    if (progress >= stepProgress - 0.2) return '[....]';
    return '[PENDING]';
  };

  return (
    <section
      className="flex w-full max-w-[640px] flex-col gap-4 border border-crt-line bg-crt-black p-panel text-[16px] text-crt-ink shadow-[inset_0_0_30px_rgba(51,255,51,0.08),_0_0_24px_rgba(51,255,51,0.15)]"
      data-testid="bios-loading"
      data-system="bios"
    >
      <header className="text-center">
        <div className="text-[20px] tracking-[0.1em] text-crt-amber text-glow-amber">
          X-ALGORITHM VISUALIZER v1.0
        </div>
        <div className="text-[14px] text-crt-ink/70">
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

      <div className="mt-2">
        <div className="tracking-[0.1em] text-crt-ink text-glow-green">
          SYSTEM INITIALIZATION
        </div>
        <div className="overflow-hidden text-clip whitespace-nowrap text-crt-ink/50">
          {'═'.repeat(60)}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {INIT_STEPS.map((step, index) => (
          <div key={step.id} className="flex justify-between text-crt-ink">
            <span>&gt; {step.label}</span>
            <span className="font-bold text-crt-amber">
              {getStepStatus(index)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-2">
        <div className="flex items-center justify-between gap-4">
          <div
            className="font-mono tracking-[0.05em] text-crt-cyan text-glow-cyan"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {barFill}{barEmpty} {progressPercent}%
          </div>
          <div className="font-mono text-crt-amber text-glow-amber" data-testid="elapsed-timer">
            [{formatElapsedTime(elapsed)}]
          </div>
        </div>
        {currentStep && (
          <div className="mt-1 text-crt-ink/80">{currentStep}</div>
        )}
      </div>

      <div className="mt-4">
        <div className="overflow-hidden text-clip whitespace-nowrap text-crt-ink/50">
          {'─'.repeat(60)}
        </div>
        <div className="text-crt-amber/80 text-glow-amber">
          [TIP] This visualizer uses real ML models to compute real scores.
        </div>
        <div className="text-crt-amber/80 text-glow-amber">
          The download is worth it. Trust us.
        </div>
      </div>
    </section>
  );
}
