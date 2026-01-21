import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ChapterSkeleton from './ChapterSkeleton';

describe('ChapterSkeleton', () => {
  it('renders a skeleton placeholder', () => {
    render(<ChapterSkeleton />);
    expect(screen.getByTestId('chapter-skeleton')).toBeInTheDocument();
  });
});
