import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ATTRIBUTION } from '../../data/attribution';
import Marquee from './Marquee';

describe('Marquee', () => {
  it('links to attribution targets', () => {
    render(<Marquee />);
    expect(screen.getByTestId('marquee-github')).toHaveAttribute(
      'href',
      ATTRIBUTION.links.github
    );
    expect(screen.getByTestId('marquee-twitter')).toHaveAttribute(
      'href',
      ATTRIBUTION.links.twitter
    );
  });
});
