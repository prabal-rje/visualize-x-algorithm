import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ATTRIBUTION } from '../../data/attribution';
import Marquee from './Marquee';

describe('Marquee', () => {
  it('links to attribution targets', () => {
    render(<Marquee />);
    screen.getAllByTestId('marquee-github').forEach((link) => {
      expect(link).toHaveAttribute('href', ATTRIBUTION.links.github);
    });
    screen.getAllByTestId('marquee-twitter').forEach((link) => {
      expect(link).toHaveAttribute('href', ATTRIBUTION.links.twitter);
    });
  });

  it('renders duplicated marquee tracks for seamless loop', () => {
    render(<Marquee />);
    expect(screen.getAllByTestId('marquee-track')).toHaveLength(2);
  });
});
