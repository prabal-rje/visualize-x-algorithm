import type { PropsWithChildren } from 'react';
import styles from '../../styles/crt.module.css';

export default function CRTOverlay({ children }: PropsWithChildren) {
  return (
    <div className={styles.crtRoot} data-testid="crt-overlay">
      <div className={styles.crtFrame}>
        <div className={styles.crtContent}>{children}</div>
        <div className={styles.crtBloom} />
        <div className={styles.crtMask} data-testid="crt-mask" />
        <div className={styles.crtScanlines} data-testid="crt-scanlines" />
        <div className={styles.crtAberrationRed} />
        <div className={styles.crtAberrationBlue} />
        <div className={styles.crtFlicker} />
        <div className={styles.crtGlare} />
        <div className={styles.crtNoise} data-testid="crt-noise" />
      </div>
    </div>
  );
}
