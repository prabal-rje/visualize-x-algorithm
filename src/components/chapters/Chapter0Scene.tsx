import ConfigPanel from '../layout/ConfigPanel';
import TypewriterText from '../visualization/TypewriterText';
import styles from '../../styles/chapter0-scene.module.css';

type Chapter0SceneProps = {
  currentStep: number;
  isActive: boolean;
};

const STEP_LABELS = ['0A: Persona', '0B: Audience', '0C: Tweet Draft'];
const STEP_NARRATION = [
  'Choose who you are in this run. The persona sets tone and affinity.',
  'Blend the audience mix to determine who this message resonates with.',
  'Draft the tweet that will enter the simulation pipeline.'
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
