import type { CSSProperties, PropsWithChildren } from 'react';
import { BARREL_MAP_DATA_URI } from './barrelDistortion';
import { DEFAULT_CRT_CONFIG } from './crtConfig';
import type { CRTConfig } from './crtConfig';
import styles from '../../styles/crt.module.css';

type CRTOverlayProps = PropsWithChildren<{
  config?: CRTConfig;
}>;

export default function CRTOverlay({ children, config }: CRTOverlayProps) {
  const crtConfig = config ?? DEFAULT_CRT_CONFIG;
  const frameRadius = 20;
  const barrelScale = Math.round((crtConfig.power ? crtConfig.curvature : 0) * 32);
  const contentOpacity = crtConfig.power ? 1 : 0;
  const phosphorIntensity = Math.min(Math.max(crtConfig.phosphorIntensity, 0), 1);
  const phosphorPersistenceMs = Math.round(400 + phosphorIntensity * 1000);
  const phosphorGlow = 4 + phosphorIntensity * 6;
  const phosphorGlowStrong = phosphorGlow * 2;
  const phosphorAfterglow = 0.08 + phosphorIntensity * 0.2;
  const phosphorTracer = 0.1 + phosphorIntensity * 0.25;
  const frameFilter = `blur(${crtConfig.power ? '0.35px' : '0px'}) contrast(${
    crtConfig.power ? 1.1 : 0.9
  }) brightness(${crtConfig.power ? crtConfig.brightness : 0}) saturate(${
    crtConfig.power ? 1.1 : 0
  })`;
  const filterChain = `url(#barrel-distortion) ${frameFilter}`;

  const frameStyle = {
    borderRadius: `${frameRadius}px`,
    transform: `scale(${1 - crtConfig.curvature * 0.015})`,
    filter: filterChain,
    boxShadow: `inset 0 0 ${100 * crtConfig.vignetteIntensity}px rgba(0,0,0,0.9), 0 0 40px var(--crt-glow)`
  };
  const rootStyle: CSSProperties & Record<string, string> = {
    '--phosphor-persistence': `${phosphorPersistenceMs}ms`,
    '--phosphor-glow': `${phosphorGlow}px`,
    '--phosphor-glow-strong': `${phosphorGlowStrong}px`,
    '--phosphor-afterglow': `${phosphorAfterglow}`,
    '--phosphor-tracer': `${phosphorTracer}`
  };

  return (
    <div className={styles.crtRoot} data-testid="crt-overlay" style={rootStyle}>
      <svg className={styles.crtFilter} aria-hidden="true">
        <filter
          id="barrel-distortion"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feImage href={BARREL_MAP_DATA_URI} result="barrelMap" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="barrelMap"
            scale={barrelScale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <div className={styles.crtFrame} style={frameStyle} data-testid="crt-frame">
        <div className={styles.crtContent} style={{ opacity: contentOpacity }}>
          {children}
        </div>
        <div
          className={styles.crtAfterglow}
          style={{ opacity: crtConfig.power ? phosphorAfterglow : 0 }}
        />
        <div
          className={styles.crtTracer}
          style={{ opacity: crtConfig.power ? phosphorTracer : 0 }}
        />
        <div
          className={styles.crtBloom}
          style={{ opacity: crtConfig.power ? 0.25 : 0 }}
        />
        <div
          className={styles.crtMask}
          data-testid="crt-mask"
          style={{ opacity: crtConfig.power ? 0.15 : 0 }}
        />
        <div
          className={styles.crtScanlines}
          data-testid="crt-scanlines"
          style={{ opacity: crtConfig.power ? crtConfig.scanlineIntensity : 0 }}
        />
        <div
          className={styles.crtAberrationRed}
          style={{
            opacity: crtConfig.power ? 0.4 : 0,
            transform: `translate(${crtConfig.chromaticAberration * 2}px, 0)`
          }}
        />
        <div
          className={styles.crtAberrationBlue}
          style={{
            opacity: crtConfig.power ? 0.4 : 0,
            transform: `translate(${-crtConfig.chromaticAberration * 2}px, 0)`
          }}
        />
        <div
          className={styles.crtFlicker}
          style={{ opacity: crtConfig.power ? 0.03 : 0 }}
        />
        <div className={styles.crtGlare} />
        <div
          className={styles.crtNoise}
          data-testid="crt-noise"
          style={{ opacity: crtConfig.power ? crtConfig.noiseIntensity * 0.1 : 0 }}
        />
      </div>
      {!crtConfig.power && <div className={styles.crtPowerOff} />}
    </div>
  );
}
