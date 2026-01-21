import type { FormEvent } from 'react';
import type { CRTConfig } from './crtConfig';
import styles from '../../styles/crt-controls.module.css';

type CRTControlsProps = {
  config: CRTConfig;
  onChange: (config: CRTConfig) => void;
};

export const createNumberUpdater =
  (config: CRTConfig, onChange: CRTControlsProps['onChange']) =>
  (key: keyof CRTConfig) =>
  (event: FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    onChange({ ...config, [key]: value });
  };

export default function CRTControls({ config, onChange }: CRTControlsProps) {
  const setNumber = createNumberUpdater(config, onChange);

  return (
    <aside className={styles.panel} data-testid="crt-controls">
      <div className={styles.header}>
        <span className={styles.statusLight} aria-hidden="true" />
        <span className={styles.title}>CRT CONTROL</span>
        <button
          className={styles.powerButton}
          data-testid="crt-toggle-power"
          onClick={() => onChange({ ...config, power: !config.power })}
          type="button"
        >
          {config.power ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className={styles.section}>
        <label className={styles.label} htmlFor="phosphor">
          Phosphor
        </label>
        <input
          className={styles.slider}
          data-testid="crt-slider-phosphor"
          id="phosphor"
          max={1}
          min={0}
          onInput={setNumber('phosphorIntensity')}
          step={0.05}
          type="range"
          value={config.phosphorIntensity}
        />
      </div>

      <div className={styles.section}>
        <label className={styles.label} htmlFor="scanlines">
          Scanlines
        </label>
        <input
          className={styles.slider}
          data-testid="crt-slider-scanlines"
          id="scanlines"
          max={1}
          min={0}
          onInput={setNumber('scanlineIntensity')}
          step={0.05}
          type="range"
          value={config.scanlineIntensity}
        />
      </div>

      <div className={styles.section}>
        <label className={styles.label} htmlFor="curvature">
          Curvature
        </label>
        <input
          className={styles.slider}
          data-testid="crt-slider-curvature"
          id="curvature"
          max={1.5}
          min={0}
          onInput={setNumber('curvature')}
          step={0.1}
          type="range"
          value={config.curvature}
        />
      </div>

      <div className={styles.section}>
        <label className={styles.label} htmlFor="aberration">
          RGB Shift
        </label>
        <input
          className={styles.slider}
          data-testid="crt-slider-aberration"
          id="aberration"
          max={1}
          min={0}
          onInput={setNumber('chromaticAberration')}
          step={0.05}
          type="range"
          value={config.chromaticAberration}
        />
      </div>

      <div className={styles.section}>
        <label className={styles.label} htmlFor="noise">
          Noise
        </label>
        <input
          className={styles.slider}
          data-testid="crt-slider-noise"
          id="noise"
          max={1}
          min={0}
          onInput={setNumber('noiseIntensity')}
          step={0.05}
          type="range"
          value={config.noiseIntensity}
        />
      </div>

      <div className={styles.section}>
        <label className={styles.label} htmlFor="vignette">
          Vignette
        </label>
        <input
          className={styles.slider}
          data-testid="crt-slider-vignette"
          id="vignette"
          max={1}
          min={0}
          onInput={setNumber('vignetteIntensity')}
          step={0.05}
          type="range"
          value={config.vignetteIntensity}
        />
      </div>

      <div className={styles.section}>
        <label className={styles.label} htmlFor="brightness">
          Brightness
        </label>
        <input
          className={styles.slider}
          data-testid="crt-slider-brightness"
          id="brightness"
          max={1.5}
          min={0.5}
          onInput={setNumber('brightness')}
          step={0.05}
          type="range"
          value={config.brightness}
        />
      </div>
    </aside>
  );
}
