import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import CandidateStreams from './CandidateStreams';

describe('CandidateStreams', () => {
  const mockThunderPosts = [
    { id: 't1', preview: 'Tech news from @friend' },
    { id: 't2', preview: 'Update from @colleague' },
    { id: 't3', preview: 'New post from @favorite' }
  ];

  const mockPhoenixPosts = [
    { id: 'p1', preview: 'AI discovers new protein' },
    { id: 'p2', preview: 'Viral meme trending' },
    { id: 'p3', preview: 'Breaking: Market update' }
  ];

  it('renders with testid', () => {
    render(
      <CandidateStreams
        thunderPosts={mockThunderPosts}
        phoenixPosts={mockPhoenixPosts}
      />
    );
    expect(screen.getByTestId('candidate-streams')).toBeInTheDocument();
  });

  it('renders Thunder stream section', () => {
    render(
      <CandidateStreams
        thunderPosts={mockThunderPosts}
        phoenixPosts={mockPhoenixPosts}
      />
    );
    expect(screen.getByTestId('thunder-stream')).toBeInTheDocument();
    expect(screen.getByText(/THUNDER/)).toBeInTheDocument();
  });

  it('renders Phoenix stream section', () => {
    render(
      <CandidateStreams
        thunderPosts={mockThunderPosts}
        phoenixPosts={mockPhoenixPosts}
      />
    );
    expect(screen.getByTestId('phoenix-stream')).toBeInTheDocument();
    expect(screen.getByText(/PHOENIX/)).toBeInTheDocument();
  });

  it('displays Thunder posts', () => {
    render(
      <CandidateStreams
        thunderPosts={mockThunderPosts}
        phoenixPosts={mockPhoenixPosts}
      />
    );
    expect(screen.getByText(/Tech news from @friend/)).toBeInTheDocument();
  });

  it('displays Phoenix posts', () => {
    render(
      <CandidateStreams
        thunderPosts={mockThunderPosts}
        phoenixPosts={mockPhoenixPosts}
      />
    );
    expect(screen.getByText(/AI discovers new protein/)).toBeInTheDocument();
  });

  it('shows In-Network label for Thunder', () => {
    render(
      <CandidateStreams
        thunderPosts={mockThunderPosts}
        phoenixPosts={mockPhoenixPosts}
      />
    );
    expect(screen.getByText(/In-Network/i)).toBeInTheDocument();
  });

  it('shows Out-of-Network label for Phoenix', () => {
    render(
      <CandidateStreams
        thunderPosts={mockThunderPosts}
        phoenixPosts={mockPhoenixPosts}
      />
    );
    expect(screen.getByText(/Out-of-Network/i)).toBeInTheDocument();
  });

  it('applies isActive state', () => {
    render(
      <CandidateStreams
        thunderPosts={mockThunderPosts}
        phoenixPosts={mockPhoenixPosts}
        isActive={true}
      />
    );
    const element = screen.getByTestId('candidate-streams');
    expect(element).toHaveAttribute('data-active', 'true');
  });

  it('handles empty streams', () => {
    render(<CandidateStreams thunderPosts={[]} phoenixPosts={[]} />);
    expect(screen.getByTestId('thunder-stream')).toBeInTheDocument();
    expect(screen.getByTestId('phoenix-stream')).toBeInTheDocument();
  });
});
