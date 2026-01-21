import { useState } from 'react';
import { useConfigStore } from '../../stores/config';
import styles from '../../styles/function-panel.module.css';

export type FunctionInfo = {
  name: string;
  file: string;
  summary: string;
  githubUrl: string;
};

type FunctionPanelProps = {
  info?: FunctionInfo;
};

export default function FunctionPanel({ info }: FunctionPanelProps) {
  const expertMode = useConfigStore((state) => state.expertMode);
  const [expanded, setExpanded] = useState(false);

  // When no info is provided, render just the placeholder container
  if (!info) {
    return <div data-testid="function-panel" className={styles.panel} />;
  }

  const showDetails = expertMode || expanded;

  return (
    <div data-testid="function-panel" className={styles.panel}>
      <p className={styles.summary}>{info.summary}</p>

      {!expertMode && !expanded && (
        <button
          type="button"
          className={styles.learnMoreButton}
          onClick={() => setExpanded(true)}
        >
          Learn more
        </button>
      )}

      {showDetails && (
        <div className={styles.details}>
          <p className={styles.functionName}>{info.name}</p>
          <p className={styles.filePath}>{info.file}</p>
          <a
            href={info.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sourceLink}
          >
            View source
          </a>
        </div>
      )}
    </div>
  );
}
