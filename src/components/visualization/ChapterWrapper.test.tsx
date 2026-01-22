import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ChapterWrapper from './ChapterWrapper';

describe('ChapterWrapper', () => {

  it('renders children', () => {
    render(
      <ChapterWrapper chapterIndex={0} isActive={true}>
        <div data-testid="chapter-content">Content</div>
      </ChapterWrapper>
    );
    expect(screen.getByTestId('chapter-content')).toBeInTheDocument();
  });

  it('renders with data-testid', () => {
    render(
      <ChapterWrapper chapterIndex={1} isActive={true}>
        <div>Content</div>
      </ChapterWrapper>
    );
    expect(screen.getByTestId('chapter-wrapper-1')).toBeInTheDocument();
  });

  it('sets data-active attribute when active', () => {
    render(
      <ChapterWrapper chapterIndex={0} isActive={true}>
        <div>Content</div>
      </ChapterWrapper>
    );
    const wrapper = screen.getByTestId('chapter-wrapper-0');
    expect(wrapper).toHaveAttribute('data-active', 'true');
  });

  it('sets data-active to false when not active', () => {
    render(
      <ChapterWrapper chapterIndex={0} isActive={false}>
        <div>Content</div>
      </ChapterWrapper>
    );
    const wrapper = screen.getByTestId('chapter-wrapper-0');
    expect(wrapper).toHaveAttribute('data-active', 'false');
  });

  it('marks wrapper as in-view by default', () => {
    render(
      <ChapterWrapper chapterIndex={0} isActive={true}>
        <div>Content</div>
      </ChapterWrapper>
    );
    const wrapper = screen.getByTestId('chapter-wrapper-0');
    expect(wrapper).toHaveAttribute('data-in-view', 'true');
  });

  it('marks wrapper as design-system layout', () => {
    render(
      <ChapterWrapper chapterIndex={2} isActive={true}>
        <div>Content</div>
      </ChapterWrapper>
    );
    const wrapper = screen.getByTestId('chapter-wrapper-2');
    expect(wrapper).toHaveAttribute('data-system', 'chapter');
  });

  it('mounts without error when active', () => {
    // GSAP animations run on mount - this test verifies no errors are thrown
    expect(() => {
      render(
        <ChapterWrapper chapterIndex={0} isActive={true}>
          <div>Content</div>
        </ChapterWrapper>
      );
    }).not.toThrow();
  });

  it('renders chapter title when provided', () => {
    render(
      <ChapterWrapper chapterIndex={0} isActive={true} title="THE REQUEST">
        <div>Content</div>
      </ChapterWrapper>
    );
    expect(screen.getByText('THE REQUEST')).toBeInTheDocument();
  });
});
