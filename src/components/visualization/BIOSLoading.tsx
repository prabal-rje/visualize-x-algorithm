import { useMLStore } from '../../stores/ml';
import styles from '../../styles/bios-loading.module.css';

const INIT_STEPS = [
  { id: 'neural', label: 'Establishing neural link...' },
  { id: 'model', label: 'Loading semantic processor (22.4 MB)...' },
  { id: 'embeddings', label: 'Calibrating embedding matrices...' },
  { id: 'filters', label: 'Initializing filter cascade...' },
  { id: 'scoring', label: 'Connecting to scoring transformers...' }
];

export default function BIOSLoading() {
  const progress = useMLStore((state) => state.progress);
  const currentStep = useMLStore((state) => state.currentStep);

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
    <section className={styles.container} data-testid="bios-loading">
      <header className={styles.header}>
        <div className={styles.title}>X-ALGORITHM VISUALIZER v1.0</div>
        <div className={styles.copyright}>(c) 2026 @prabal_</div>
      </header>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>SYSTEM INITIALIZATION</div>
        <div className={styles.divider}>{'═'.repeat(60)}</div>
      </div>

      <div className={styles.steps}>
        {INIT_STEPS.map((step, index) => (
          <div key={step.id} className={styles.step}>
            <span>&gt; {step.label}</span>
            <span className={styles.stepStatus}>{getStepStatus(index)}</span>
          </div>
        ))}
      </div>

      <div className={styles.progressSection}>
        <div
          className={styles.progressBar}
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {barFill}{barEmpty} {progressPercent}%
        </div>
        {currentStep && <div className={styles.currentStep}>{currentStep}</div>}
      </div>

      <div className={styles.footer}>
        <div className={styles.divider}>{'─'.repeat(60)}</div>
        <div className={styles.tip}>
          [TIP] This visualizer uses real ML models to compute real scores.
        </div>
        <div className={styles.tip}>
          The download is worth it. Trust us.
        </div>
      </div>
    </section>
  );
}
