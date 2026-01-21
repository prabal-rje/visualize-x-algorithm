import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useConfigStore } from '../../stores/config';
import FunctionPanel, { type FunctionInfo } from './FunctionPanel';

describe('FunctionPanel', () => {
  const mockFunctionInfo: FunctionInfo = {
    name: 'get_scored_posts()',
    file: 'home-mixer/server.rs',
    summary: 'Receiving timeline request from client',
    githubUrl: 'https://github.com/xai-org/x-algorithm/blob/main/home-mixer/server.rs'
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
        screen.getByText('Receiving timeline request from client')
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
      expect(screen.queryByText('get_scored_posts()')).not.toBeInTheDocument();
      expect(
        screen.queryByText('home-mixer/server.rs')
      ).not.toBeInTheDocument();
    });

    it('expands to show technical details when Learn more clicked', () => {
      render(<FunctionPanel info={mockFunctionInfo} />);
      fireEvent.click(screen.getByRole('button', { name: /learn more/i }));
      expect(screen.getByText('get_scored_posts()')).toBeInTheDocument();
      expect(screen.getByText('home-mixer/server.rs')).toBeInTheDocument();
    });

    it('shows GitHub link when expanded', () => {
      render(<FunctionPanel info={mockFunctionInfo} />);
      fireEvent.click(screen.getByRole('button', { name: /learn more/i }));
      const link = screen.getByRole('link', { name: /view source/i });
      expect(link).toHaveAttribute(
        'href',
        'https://github.com/xai-org/x-algorithm/blob/main/home-mixer/server.rs'
      );
    });
  });

  describe('expert mode', () => {
    beforeEach(() => {
      useConfigStore.setState({ expertMode: true });
    });

    it('renders a clickable file link with icon', () => {
      render(<FunctionPanel info={mockFunctionInfo} />);
      const link = screen.getByRole('link', {
        name: /home-mixer\/server\.rs/i
      });
      expect(link).toHaveAttribute('href', mockFunctionInfo.githubUrl);
      expect(screen.getByTestId('function-file-icon')).toBeInTheDocument();
    });

    it('shows technical details by default', () => {
      render(<FunctionPanel info={mockFunctionInfo} />);
      expect(screen.getByText('get_scored_posts()')).toBeInTheDocument();
      expect(screen.getByText('home-mixer/server.rs')).toBeInTheDocument();
    });

    it('shows summary text', () => {
      render(<FunctionPanel info={mockFunctionInfo} />);
      expect(
        screen.getByText('Receiving timeline request from client')
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
        'https://github.com/xai-org/x-algorithm/blob/main/home-mixer/server.rs'
      );
    });
  });
});
