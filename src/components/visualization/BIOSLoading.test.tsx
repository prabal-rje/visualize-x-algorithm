import { render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import BIOSLoading from './BIOSLoading';
import { useMLStore } from '../../stores/ml';

describe('BIOSLoading', () => {
  beforeEach(() => {
    useMLStore.setState({
      status: 'loading',
      progress: 0.5,
      currentStep: 'Loading semantic processor...',
      error: null
    });
  });

  it('has data-testid="bios-loading" on root element', () => {
    render(<BIOSLoading />);
    expect(screen.getByTestId('bios-loading')).toBeInTheDocument();
  });

  it('marks bios loading as design-system layout', () => {
    render(<BIOSLoading />);
    expect(screen.getByTestId('bios-loading')).toHaveAttribute(
      'data-system',
      'bios'
    );
  });

  it('displays progress bar with role="progressbar"', () => {
    render(<BIOSLoading />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
    expect(progressbar).toHaveAttribute('aria-valuenow', '50');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
  });

  it('shows current step text from store', () => {
    useMLStore.setState({
      status: 'loading',
      progress: 0.5,
      currentStep: 'Downloading neural weights...',
      error: null
    });
    render(<BIOSLoading />);
    // The exact text from currentStep should appear
    expect(screen.getByText('Downloading neural weights...')).toBeInTheDocument();
  });

  it('shows progress percentage', () => {
    render(<BIOSLoading />);
    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });

  it('shows initialization steps with status indicators', () => {
    render(<BIOSLoading />);
    expect(screen.getByText(/Establishing neural link/)).toBeInTheDocument();
  });

  it('displays title "X-ALGORITHM VISUALIZER v1.0"', () => {
    render(<BIOSLoading />);
    expect(screen.getByText('X-ALGORITHM VISUALIZER v1.0')).toBeInTheDocument();
  });

  it('shows copyright notice', () => {
    render(<BIOSLoading />);
    // Text is split across elements: "(c) 2026" and "@prabal_" in a link
    expect(screen.getByText(/\(c\) 2026/)).toBeInTheDocument();
    expect(screen.getByText('@prabal_')).toBeInTheDocument();
  });

  it('shows tip about real ML models', () => {
    render(<BIOSLoading />);
    expect(screen.getByText(/This visualizer uses real ML models/)).toBeInTheDocument();
  });

  it('updates progress bar as progress changes', () => {
    const { rerender } = render(<BIOSLoading />);

    // Initially at 50%
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');

    // Update to 75%
    useMLStore.setState({ progress: 0.75 });
    rerender(<BIOSLoading />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
  });

  it('displays progress percentage inside progress bar', () => {
    useMLStore.setState({ progress: 0.5 });
    render(<BIOSLoading />);

    // Should display percentage text inside the progress bar
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar.textContent).toMatch(/50%/);
  });
});
