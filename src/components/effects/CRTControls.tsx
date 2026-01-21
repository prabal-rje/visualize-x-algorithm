import { useState, type FormEvent } from 'react';
import type { CRTConfig } from './crtConfig';
import styles from '../../styles/crt-controls.module.css';
import { useAudioStore } from '../../stores/audio';
import { startAudio } from '../../audio/engine';

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
  const [isOpen, setIsOpen] = useState(false);
  const setNumber = createNumberUpdater(config, onChange);
  const audioMuted = useAudioStore((state) => state.muted);
  const toggleAudio = useAudioStore((state) => state.toggleMute);

  const handleAudioToggle = () => {
    const wasMuted = useAudioStore.getState().muted;
    toggleAudio();
    if (wasMuted) {
      void startAudio();
    }
  };

  return (
    <div
      className={styles.shell}
      data-testid="crt-controls"
      data-open={isOpen}
    >
      <button
        className={styles.handle}
        data-testid="crt-controls-handle"
        onClick={() => setIsOpen((prev) => !prev)}
        type="button"
        aria-expanded={isOpen}
        aria-controls="crt-controls-dialog"
        aria-label="Toggle CRT controls"
      >
        <span className={styles.handleLabel}>CRT CTRL</span>
      </button>

      <div
        className={styles.dialog}
        data-testid="crt-controls-dialog"
        id="crt-controls-dialog"
        role="dialog"
        aria-hidden={!isOpen}
      >
        <div className={styles.header}>
          <span className={styles.statusLight} aria-hidden="true" />
          <span className={styles.title}>CRT CONTROL</span>
          <button
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
            type="button"
          >
            CLOSE
          </button>
        </div>

        <div className={styles.headerActions}>
          <button
            className={styles.audioButton}
            data-testid="audio-toggle"
            data-muted={audioMuted}
            onClick={handleAudioToggle}
            type="button"
          >
            {audioMuted ? 'MUTED' : 'LIVE'}
          </button>
        </div>

        <div className={styles.body}>
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
        </div>
      </div>
    </div>
  );
}
