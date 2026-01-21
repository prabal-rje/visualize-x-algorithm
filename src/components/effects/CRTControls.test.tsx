import type { FormEvent } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_CRT_CONFIG } from './crtConfig';
import CRTControls, { createNumberUpdater } from './CRTControls';

describe('CRTControls', () => {
  it('renders core sliders without curvature control', () => {
    render(<CRTControls config={DEFAULT_CRT_CONFIG} onChange={() => undefined} />);
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
});
