import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Chapter5Scene from './Chapter5Scene';

describe('Chapter5Scene', () => {
  it('renders delivery chapter with top-K selector', () => {
    render(<Chapter5Scene currentStep={0} isActive={true} />);
    expect(screen.getByTestId('chapter-5-scene')).toBeInTheDocument();
    expect(screen.getByTestId('topk-selector')).toBeInTheDocument();
  });
});
