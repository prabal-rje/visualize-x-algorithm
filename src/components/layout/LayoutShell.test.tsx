import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from '../../App';
import { useMLStore } from '../../stores/ml';

describe('Layout shell', () => {
  beforeEach(() => {
    useMLStore.getState().reset();
    useMLStore.getState().setReady(); // Skip BIOS loading
  });

  afterEach(() => {
    useMLStore.getState().reset();
  });

  it('renders intro screen after model loads', async () => {
    render(<App />);
    expect(screen.getByTestId('marquee')).toBeInTheDocument();
    expect(screen.getByTestId('bios-intro')).toBeInTheDocument();
    expect(screen.getByText('START SIMULATION')).toBeInTheDocument();
  });

  it('renders main layout after dismissing intro', async () => {
    render(<App />);
    // Wait for intro to be visible
    await waitFor(() => {
      expect(screen.getByText('START SIMULATION')).toBeInTheDocument();
    });
    // Click START SIMULATION to dismiss intro
    fireEvent.click(screen.getByText('START SIMULATION'));
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
    expect(await screen.findByTestId('config-panel')).toBeInTheDocument();
  });
});
