import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import RequestVisualization from './RequestVisualization';

describe('RequestVisualization', () => {
  it('renders phone icon', () => {
    render(<RequestVisualization isActive={true} />);
    expect(screen.getByTestId('request-phone')).toBeInTheDocument();
  });

  it('renders server icon', () => {
    render(<RequestVisualization isActive={true} />);
    expect(screen.getByTestId('request-server')).toBeInTheDocument();
  });

  it('renders request arrow/line', () => {
    render(<RequestVisualization isActive={true} />);
    expect(screen.getByTestId('request-line')).toBeInTheDocument();
  });

  it('shows packet animation when active', () => {
    render(<RequestVisualization isActive={true} />);
    expect(screen.getByTestId('request-packet')).toBeInTheDocument();
  });

  it('hides packet when not active', () => {
    render(<RequestVisualization isActive={false} />);
    expect(screen.queryByTestId('request-packet')).not.toBeInTheDocument();
  });

  it('renders with testid', () => {
    render(<RequestVisualization isActive={true} />);
    expect(screen.getByTestId('request-visualization')).toBeInTheDocument();
  });

  it('shows user ID when provided', () => {
    render(<RequestVisualization isActive={true} userId="12345" />);
    expect(screen.getByText(/12345/)).toBeInTheDocument();
  });

  it('applies data-active attribute', () => {
    render(<RequestVisualization isActive={true} />);
    const element = screen.getByTestId('request-visualization');
    expect(element).toHaveAttribute('data-active', 'true');
  });
});
