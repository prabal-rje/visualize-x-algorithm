import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TokenizationFlow from './TokenizationFlow';

describe('TokenizationFlow', () => {
  it('shows sub-token chips with pooling pulses', () => {
    render(<TokenizationFlow tweet="Hello world" isActive={true} />);
    expect(screen.getByTestId('tokenization-flow')).toBeInTheDocument();
    expect(screen.getByText('TOKENS')).toBeInTheDocument();
    const tokens = screen.getAllByTestId('token-chip');
    expect(tokens).toHaveLength(4);
    expect(screen.getAllByTestId('pool-pulse')).toHaveLength(tokens.length);
    expect(screen.getByText(/128-d/i)).toBeInTheDocument();
  });

  it('uses word-boundary markers and omits mean pool label', () => {
    render(<TokenizationFlow tweet="Hello world" isActive={true} />);
    const tokens = screen.getAllByTestId('token-chip').map((node) => node.textContent);
    expect(tokens).toEqual(['^Hel', 'lo', '_wor', 'ld']);
    expect(screen.getByTestId('token-total')).toHaveTextContent('4');
    expect(screen.queryByText(/mean pool/i)).not.toBeInTheDocument();
    const cells = screen.getAllByTestId('token-vector-cell');
    expect(cells[0].style.backgroundColor).toMatch(/rgba/);
  });
});
