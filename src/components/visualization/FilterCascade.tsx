import styles from '../../styles/filter-cascade.module.css';
import FilterGate from './FilterGate';

type GateTweet = {
  id: string;
  text: string;
  status: 'pass' | 'fail' | 'pending';
};

type GateDefinition = {
  id: string;
  label: string;
  functionName: string;
  totalIn: number;
  totalPass: number;
  totalFail: number;
  tweets: GateTweet[];
};

type FilterCascadeProps = {
  gates: GateDefinition[];
  activeGateIndex: number;
  highlightTweet?: string;
  isActive?: boolean;
};

export default function FilterCascade({
  gates,
  activeGateIndex,
  highlightTweet,
  isActive = true
}: FilterCascadeProps) {
  const finalSurvivors = gates[gates.length - 1]?.totalPass ?? 0;

  return (
    <div className={styles.container} data-testid="filter-cascade" data-active={isActive}>
      {gates.map((gate, index) => (
        <FilterGate
          key={gate.id}
          label={gate.label}
          functionName={gate.functionName}
          totalIn={gate.totalIn}
          totalPass={gate.totalPass}
          totalFail={gate.totalFail}
          tweets={gate.tweets}
          highlightTweet={highlightTweet}
          isActive={isActive && index === activeGateIndex}
        />
      ))}
      <div className={styles.survivors}>
        <span className={styles.survivorsLabel}>SURVIVORS</span>
        <span className={styles.survivorsValue}>{finalSurvivors}</span>
      </div>
    </div>
  );
}
