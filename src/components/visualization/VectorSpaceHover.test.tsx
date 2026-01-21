import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import VectorSpaceHover from './VectorSpaceHover';

describe('VectorSpaceHover', () => {
  it('renders hovered tweet details', () => {
    render(<VectorSpaceHover tweet="Hello there" similarity={0.42} />);
    expect(screen.getByText(/Hello there/)).toBeInTheDocument();
    expect(screen.getByText(/0.42/)).toBeInTheDocument();
  });
});
