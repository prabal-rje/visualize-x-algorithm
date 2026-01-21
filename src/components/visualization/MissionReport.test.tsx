import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import MissionReport from './MissionReport';

describe('MissionReport', () => {
  const defaultProps = {
    reach: 1500,
    resonance: 0.847,
    momentum: 12.5,
    percentile: 0.05,
    onReplay: vi.fn()
  };

  it('renders "Mission Report" title', () => {
    render(<MissionReport {...defaultProps} />);
    expect(screen.getByText('Mission Report')).toBeInTheDocument();
  });

  it('displays reach value', () => {
    render(<MissionReport {...defaultProps} reach={2500} />);
    expect(screen.getByText('2500')).toBeInTheDocument();
  });

  it('displays resonance formatted to 2 decimals', () => {
    render(<MissionReport {...defaultProps} resonance={0.847} />);
    expect(screen.getByText('0.85')).toBeInTheDocument();
  });

  it('displays momentum with % suffix', () => {
    render(<MissionReport {...defaultProps} momentum={12.5} />);
    expect(screen.getByText('12.5%')).toBeInTheDocument();
  });

  it('displays correct badge based on percentile', () => {
    // percentile <= 0.1 should show "Signal Adept"
    render(<MissionReport {...defaultProps} percentile={0.05} />);
    expect(screen.getByText('Signal Adept')).toBeInTheDocument();
  });

  it('displays Vector Guide for percentile <= 0.3', () => {
    render(<MissionReport {...defaultProps} percentile={0.25} />);
    expect(screen.getByText('Vector Guide')).toBeInTheDocument();
  });

  it('displays Signal Scout for percentile <= 0.6', () => {
    render(<MissionReport {...defaultProps} percentile={0.5} />);
    expect(screen.getByText('Signal Scout')).toBeInTheDocument();
  });

  it('displays Signal Initiate for percentile > 0.6', () => {
    render(<MissionReport {...defaultProps} percentile={0.8} />);
    expect(screen.getByText('Signal Initiate')).toBeInTheDocument();
  });

  it('calls onReplay when button clicked', () => {
    const onReplay = vi.fn();
    render(<MissionReport {...defaultProps} onReplay={onReplay} />);
    fireEvent.click(screen.getByText('Run Another Simulation'));
    expect(onReplay).toHaveBeenCalledTimes(1);
  });

  it('has data-testid="mission-report" on root', () => {
    render(<MissionReport {...defaultProps} />);
    expect(screen.getByTestId('mission-report')).toBeInTheDocument();
  });
});
