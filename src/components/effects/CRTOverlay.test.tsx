import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CRTOverlay from './CRTOverlay';

describe('CRTOverlay', () => {
  it('renders scanline layer', () => {
    render(<CRTOverlay />);
    expect(screen.getByTestId('crt-overlay')).toBeInTheDocument();
    expect(screen.getByTestId('crt-scanlines')).toBeInTheDocument();
    expect(screen.getByTestId('crt-noise')).toBeInTheDocument();
    expect(screen.getByTestId('crt-mask')).toBeInTheDocument();
  });

  it('applies barrel distortion filter to the frame', () => {
    render(<CRTOverlay />);
    const [frame] = screen.getAllByTestId('crt-frame');
    expect(frame.style.filter).toContain('url(#barrel-distortion)');
  });
});
