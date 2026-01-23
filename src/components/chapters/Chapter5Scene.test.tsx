import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Chapter5Scene from './Chapter5Scene';

describe('Chapter5Scene', () => {
  it('renders delivery chapter with top-K selector', () => {
    render(<Chapter5Scene currentStep={0} isActive={true} />);
    expect(screen.getByTestId('chapter-5-scene')).toBeInTheDocument();
    expect(screen.getByTestId('topk-selector')).toBeInTheDocument();
  });

  it('shows user tweet in the top-K ranking', () => {
    render(<Chapter5Scene currentStep={0} isActive={true} />);
    expect(screen.getByText('Your Tweet')).toBeInTheDocument();
  });

  it('renders reach forecast panel on step 1', () => {
    render(<Chapter5Scene currentStep={1} isActive={true} />);
    expect(screen.getByTestId('audience-reach')).toBeInTheDocument();
  });

  it('renders reaction burst panel on step 2', () => {
    render(<Chapter5Scene currentStep={2} isActive={true} />);
    expect(screen.getByTestId('reaction-burst')).toBeInTheDocument();
  });

  it('renders delivery summary on step 3', () => {
    render(<Chapter5Scene currentStep={3} isActive={true} />);
    expect(screen.getByTestId('delivery-summary')).toBeInTheDocument();
    expect(screen.getByText('PERFORMANCE SUMMARY')).toBeInTheDocument();
    expect(screen.getByText('Tier')).toBeInTheDocument();
  });

  it('stages delivery summary rows for progressive reveal', () => {
    render(<Chapter5Scene currentStep={3} isActive={true} />);
    const summary = screen.getByTestId('delivery-summary');
    expect(summary).toHaveAttribute('data-active', 'true');
    expect(summary.querySelectorAll('[data-reveal]').length).toBeGreaterThan(0);
  });
});
