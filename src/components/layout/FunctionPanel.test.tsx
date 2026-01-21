import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useConfigStore } from '../../stores/config';
import FunctionPanel, { type FunctionInfo } from './FunctionPanel';

describe('FunctionPanel', () => {
  const mockFunctionInfo: FunctionInfo = {
    name: 'simulateEngagement()',
    file: 'src/simulation/simulate.ts',
    summary: 'Calculates how likely users are to engage with your tweet',
    githubUrl: 'https://github.com/twitter/the-algorithm/blob/main/src/simulate.ts'
  };

  beforeEach(() => {
    useConfigStore.setState({
      expertMode: false,
      setExpertMode: useConfigStore.getState().setExpertMode
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with data-testid="function-panel"', () => {
    render(<FunctionPanel info={mockFunctionInfo} />);
    expect(screen.getByTestId('function-panel')).toBeInTheDocument();
  });

  describe('non-expert mode', () => {
    beforeEach(() => {
      useConfigStore.setState({ expertMode: false });
    });

    it('shows summary text', () => {
      render(<FunctionPanel info={mockFunctionInfo} />);
      expect(
        screen.getByText('Calculates how likely users are to engage with your tweet')
      ).toBeInTheDocument();
    });

    it('shows "Learn more" button', () => {
      render(<FunctionPanel info={mockFunctionInfo} />);
      expect(
        screen.getByRole('button', { name: /learn more/i })
      ).toBeInTheDocument();
    });

    it('does not show technical details by default', () => {
      render(<FunctionPanel info={mockFunctionInfo} />);
      expect(screen.queryByText('simulateEngagement()')).not.toBeInTheDocument();
      expect(
        screen.queryByText('src/simulation/simulate.ts')
      ).not.toBeInTheDocument();
    });

    it('expands to show technical details when Learn more clicked', () => {
      render(<FunctionPanel info={mockFunctionInfo} />);
      fireEvent.click(screen.getByRole('button', { name: /learn more/i }));
      expect(screen.getByText('simulateEngagement()')).toBeInTheDocument();
      expect(screen.getByText('src/simulation/simulate.ts')).toBeInTheDocument();
    });

    it('shows GitHub link when expanded', () => {
      render(<FunctionPanel info={mockFunctionInfo} />);
      fireEvent.click(screen.getByRole('button', { name: /learn more/i }));
      const link = screen.getByRole('link', { name: /view source/i });
      expect(link).toHaveAttribute(
        'href',
        'https://github.com/twitter/the-algorithm/blob/main/src/simulate.ts'
      );
    });
  });

  describe('expert mode', () => {
    beforeEach(() => {
      useConfigStore.setState({ expertMode: true });
    });

    it('shows technical details by default', () => {
      render(<FunctionPanel info={mockFunctionInfo} />);
      expect(screen.getByText('simulateEngagement()')).toBeInTheDocument();
      expect(screen.getByText('src/simulation/simulate.ts')).toBeInTheDocument();
    });

    it('shows summary text', () => {
      render(<FunctionPanel info={mockFunctionInfo} />);
      expect(
        screen.getByText('Calculates how likely users are to engage with your tweet')
      ).toBeInTheDocument();
    });

    it('does not show "Learn more" button', () => {
      render(<FunctionPanel info={mockFunctionInfo} />);
      expect(
        screen.queryByRole('button', { name: /learn more/i })
      ).not.toBeInTheDocument();
    });

    it('shows GitHub link with correct href', () => {
      render(<FunctionPanel info={mockFunctionInfo} />);
      const link = screen.getByRole('link', { name: /view source/i });
      expect(link).toHaveAttribute(
        'href',
        'https://github.com/twitter/the-algorithm/blob/main/src/simulate.ts'
      );
    });
  });
});
