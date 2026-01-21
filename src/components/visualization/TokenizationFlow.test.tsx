import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import TokenizationFlow from './TokenizationFlow';

describe('TokenizationFlow', () => {
  it('shows tokens and pooled vector label', () => {
    render(<TokenizationFlow tweet="Hello world" isActive={true} />);
    expect(screen.getByTestId('tokenization-flow')).toBeInTheDocument();
    expect(screen.getByText(/Tokens/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('token-chip')).toHaveLength(2);
    expect(screen.getByText(/128-d/i)).toBeInTheDocument();
  });
});
