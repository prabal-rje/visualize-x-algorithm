import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../../App';
import { useMLStore } from '../../stores/ml';

describe('Layout shell', () => {
  beforeEach(() => {
    useMLStore.getState().setReady(); // Skip BIOS loading
  });

  it('renders marquee and panels', () => {
    render(<App />);
    expect(screen.getByTestId('marquee')).toBeInTheDocument();
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
    expect(screen.getByTestId('config-panel')).toBeInTheDocument();
  });
});
