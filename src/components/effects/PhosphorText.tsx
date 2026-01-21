import type { PropsWithChildren } from 'react';
import styles from '../../styles/crt.module.css';

export default function PhosphorText({ children }: PropsWithChildren) {
  return <span className={styles.phosphorText}>{children}</span>;
}
