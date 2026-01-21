import ConfigPanel from '../layout/ConfigPanel';
import TypewriterText from '../visualization/TypewriterText';
import styles from '../../styles/chapter0-scene.module.css';

type Chapter0SceneProps = {
  currentStep: number;
  isActive: boolean;
};

const STEP_LABELS = ['0A: Persona', '0B: Audience', '0C: Tweet Draft'];
const STEP_NARRATION = [
  'You are the protagonist. Choose a persona to define how the algorithm reads your voice.',
  'Select the crowd you are speaking to. Alignment boosts your odds in the arena.',
  'Write the tweet you are about to test against the feed.'
];

export default function Chapter0Scene({ currentStep, isActive }: Chapter0SceneProps) {
  return (
    <div
      className={styles.container}
      data-testid="chapter-0-scene"
      data-active={isActive}
    >
      <div className={styles.header}>
        <span className={styles.chapterNumber}>CHAPTER 0</span>
        <h2 className={styles.title}>MISSION PREP</h2>
        <div className={styles.stepLabel}>
          {STEP_LABELS[currentStep] || STEP_LABELS[0]}
        </div>
      </div>

      <div className={styles.narration}>
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
        <ConfigPanel />
      </div>
    </div>
  );
}
