import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ConfigPanel from './ConfigPanel';

describe('ConfigPanel', () => {
  it('renders expert mode toggle and personas', () => {
    render(<ConfigPanel />);
    expect(screen.getByLabelText('Expert Mode')).toBeInTheDocument();
    expect(screen.getByText('Tech Founder')).toBeInTheDocument();
  });
});
