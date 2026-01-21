import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import DataStream from './DataStream';

describe('DataStream', () => {
  const mockEngagementHistory = [
    { action: 'liked', tweetId: 'tweet_39284', timeAgo: '2m ago' },
    { action: 'liked', tweetId: 'tweet_28371', timeAgo: '5m ago' },
    { action: 'replied', tweetId: 'tweet_19283', timeAgo: '8m ago' },
    { action: 'reposted', tweetId: 'tweet_48271', timeAgo: '1h ago' }
  ];

  const mockUserFeatures = {
    followingCount: 847,
    followerCount: 12394,
    accountAgeDays: 2847,
    verified: false,
    premium: true
  };

  it('renders with testid', () => {
    render(
      <DataStream
        engagementHistory={mockEngagementHistory}
        userFeatures={mockUserFeatures}
        isActive={true}
      />
    );
    expect(screen.getByTestId('data-stream')).toBeInTheDocument();
  });

  it('renders left stream with engagement history header', () => {
    render(
      <DataStream
        engagementHistory={mockEngagementHistory}
        userFeatures={mockUserFeatures}
        isActive={true}
      />
    );
    expect(screen.getByTestId('data-stream-left')).toBeInTheDocument();
    expect(screen.getByText(/ENGAGEMENT_HISTORY/)).toBeInTheDocument();
  });

  it('renders right stream with user profile header', () => {
    render(
      <DataStream
        engagementHistory={mockEngagementHistory}
        userFeatures={mockUserFeatures}
        isActive={true}
      />
    );
    expect(screen.getByTestId('data-stream-right')).toBeInTheDocument();
    expect(screen.getByText(/USER_PROFILE/)).toBeInTheDocument();
  });

  it('displays engagement history items', () => {
    render(
      <DataStream
        engagementHistory={mockEngagementHistory}
        userFeatures={mockUserFeatures}
        isActive={true}
      />
    );
    expect(screen.getByText(/liked: tweet_39284/)).toBeInTheDocument();
    expect(screen.getByText(/2m ago/)).toBeInTheDocument();
    expect(screen.getByText(/replied: tweet_19283/)).toBeInTheDocument();
  });

  it('displays user features', () => {
    render(
      <DataStream
        engagementHistory={mockEngagementHistory}
        userFeatures={mockUserFeatures}
        isActive={true}
      />
    );
    expect(screen.getByText(/following_count: 847/)).toBeInTheDocument();
    expect(screen.getByText(/follower_count: 12,394/)).toBeInTheDocument();
    expect(screen.getByText(/account_age: 2847 days/)).toBeInTheDocument();
    expect(screen.getByText(/verified: false/)).toBeInTheDocument();
    expect(screen.getByText(/premium: true/)).toBeInTheDocument();
  });

  it('applies data-active attribute', () => {
    render(
      <DataStream
        engagementHistory={mockEngagementHistory}
        userFeatures={mockUserFeatures}
        isActive={true}
      />
    );
    const element = screen.getByTestId('data-stream');
    expect(element).toHaveAttribute('data-active', 'true');
  });

  it('applies inactive state when not active', () => {
    render(
      <DataStream
        engagementHistory={mockEngagementHistory}
        userFeatures={mockUserFeatures}
        isActive={false}
      />
    );
    const element = screen.getByTestId('data-stream');
    expect(element).toHaveAttribute('data-active', 'false');
  });

  it('renders empty engagement history gracefully', () => {
    render(
      <DataStream
        engagementHistory={[]}
        userFeatures={mockUserFeatures}
        isActive={true}
      />
    );
    expect(screen.getByTestId('data-stream-left')).toBeInTheDocument();
  });
});
