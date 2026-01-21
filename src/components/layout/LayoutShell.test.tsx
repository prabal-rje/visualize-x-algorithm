import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../../App';

describe('Layout shell', () => {
  it('renders marquee and panels', () => {
    render(<App />);
    expect(screen.getByTestId('marquee')).toBeInTheDocument();
    expect(screen.getByTestId('timeline')).toBeInTheDocument();
    expect(screen.getByTestId('config-panel')).toBeInTheDocument();
  });
});
