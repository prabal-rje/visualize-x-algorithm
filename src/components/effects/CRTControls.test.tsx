import type { FormEvent } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_CRT_CONFIG } from './crtConfig';
import CRTControls, { createNumberUpdater } from './CRTControls';
import { useAudioStore } from '../../stores/audio';

describe('CRTControls', () => {
  beforeEach(() => {
    useAudioStore.setState({ enabled: true, muted: true });
  });

  it('opens dialog from handle click', () => {
    render(<CRTControls config={DEFAULT_CRT_CONFIG} onChange={() => undefined} />);
    fireEvent.click(screen.getByTestId('crt-controls-handle'));
    expect(screen.getByTestId('crt-controls-dialog')).toBeInTheDocument();
  });

  it('renders core sliders without curvature control', () => {
    render(<CRTControls config={DEFAULT_CRT_CONFIG} onChange={() => undefined} />);
    fireEvent.click(screen.getByTestId('crt-controls-handle'));
    expect(screen.getByTestId('crt-slider-scanlines')).toBeInTheDocument();
    expect(screen.queryByTestId('crt-slider-curvature')).not.toBeInTheDocument();
    expect(screen.getByTestId('crt-slider-noise')).toBeInTheDocument();
    expect(screen.getByTestId('crt-slider-phosphor')).toBeInTheDocument();
  });

  it('fires updates on changes', () => {
    const onChange = vi.fn();
    const updateNumber = createNumberUpdater(DEFAULT_CRT_CONFIG, onChange);
    const handler = updateNumber('scanlineIntensity');
    handler({ target: { value: '0.4' } } as unknown as FormEvent<
      HTMLInputElement
    >);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ scanlineIntensity: 0.4 })
    );
  });

  it('marks audio toggle with muted state and hides power control', () => {
    render(<CRTControls config={DEFAULT_CRT_CONFIG} onChange={() => undefined} />);
    fireEvent.click(screen.getByTestId('crt-controls-handle'));
    const audioButton = screen.getByTestId('audio-toggle');
    expect(audioButton).toHaveAttribute('data-muted', 'true');
    expect(screen.queryByTestId('crt-toggle-power')).not.toBeInTheDocument();
  });
});
