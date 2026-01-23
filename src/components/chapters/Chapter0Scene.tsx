import ConfigPanel from '../layout/ConfigPanel';
import TypewriterText from '../visualization/TypewriterText';
import styles from '../../styles/chapter0-scene.module.css';

type Chapter0SceneProps = {
  currentStep: number;
  isActive: boolean;
  onStepForward?: () => void;
  onStepBack?: () => void;
  onBeginSimulation?: () => void;
};

const STEP_LABELS = ['0A: Persona', '0B: Audience', '0C: Tweet Draft'];
const STEP_NARRATION = [
  'You are the protagonist. Choose a persona to define how the algorithm reads your voice.',
  'Select the crowd you are speaking to. Alignment boosts your odds in the arena.',
  'Write the tweet you are about to test against the feed.'
];

export default function Chapter0Scene({ currentStep, isActive, onStepForward, onStepBack, onBeginSimulation }: Chapter0SceneProps) {
  return (
    <div
      className={styles.container}
      data-testid="chapter-0-scene"
      data-active={isActive}
    >
      <div className={styles.header}>
        <span className="crt-body text-crt-ink/70 tracking-[0.2em]">CHAPTER 0</span>
        <h2 className="crt-h2">MISSION PREP</h2>
        <div className="crt-badge">
          {STEP_LABELS[currentStep] || STEP_LABELS[0]}
        </div>
      </div>

      <div className="crt-body text-center opacity-90 min-h-[48px] px-6">
        <TypewriterText
          text={STEP_NARRATION[currentStep] || STEP_NARRATION[0]}
          started={isActive}
          speed={24}
          speedVariance={10}
          showCursor={true}
          hideCursorOnComplete={true}
        />
      </div>

      <div className={styles.content}>
        <ConfigPanel
          currentStep={currentStep}
          onStepForward={onStepForward}
          onStepBack={onStepBack}
          onBeginSimulation={onBeginSimulation}
        />
      </div>
    </div>
  );
}
