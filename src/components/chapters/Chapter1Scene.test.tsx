import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Chapter1Scene from './Chapter1Scene';

describe('Chapter1Scene', () => {
  const defaultProps = {
    currentStep: 0,
    isActive: true,
    userId: '8392847293'
  };

  it('renders with testid', () => {
    render(<Chapter1Scene {...defaultProps} />);
    expect(screen.getByTestId('chapter-1-scene')).toBeInTheDocument();
  });

  it('shows chapter title', () => {
    render(<Chapter1Scene {...defaultProps} />);
    expect(screen.getByText(/THE REQUEST/)).toBeInTheDocument();
  });

  it('shows request visualization at step 0', () => {
    render(<Chapter1Scene {...defaultProps} currentStep={0} />);
    expect(screen.getByTestId('request-visualization')).toBeInTheDocument();
  });

  it('shows data stream at step 1', () => {
    render(<Chapter1Scene {...defaultProps} currentStep={1} />);
    expect(screen.getByTestId('data-stream')).toBeInTheDocument();
  });

  it('shows engagement history header in step 1', () => {
    render(<Chapter1Scene {...defaultProps} currentStep={1} />);
    expect(screen.getByText(/ENGAGEMENT_HISTORY/)).toBeInTheDocument();
  });

  it('shows user profile header in step 1', () => {
    render(<Chapter1Scene {...defaultProps} currentStep={1} />);
    expect(screen.getByText(/USER_PROFILE/)).toBeInTheDocument();
  });

  it('displays user ID', () => {
    render(<Chapter1Scene {...defaultProps} />);
    expect(screen.getByText(/8392847293/)).toBeInTheDocument();
  });

  it('applies isActive state', () => {
    render(<Chapter1Scene {...defaultProps} isActive={true} />);
    const element = screen.getByTestId('chapter-1-scene');
    expect(element).toHaveAttribute('data-active', 'true');
  });

  it('applies inactive state', () => {
    render(<Chapter1Scene {...defaultProps} isActive={false} />);
    const element = screen.getByTestId('chapter-1-scene');
    expect(element).toHaveAttribute('data-active', 'false');
  });
});
