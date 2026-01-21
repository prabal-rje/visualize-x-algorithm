import type { CSSProperties } from 'react';
import { useEffect } from 'react';
import Avatar from 'boring-avatars';
import styles from '../../styles/engagement-cascade.module.css';
import { playEngagementPing } from '../../audio/engine';

type EngagementStat = {
  id: string;
  label: string;
  predicted: number;
  actual: number;
};

type EngagementCascadeProps = {
  stats: EngagementStat[];
  isActive?: boolean;
  nodeCount?: number;
};

const REACTION_TYPES = ['like', 'reply', 'repost'] as const;
const REACTION_ICONS: Record<(typeof REACTION_TYPES)[number], string> = {
  like: '♥',
  reply: '💬',
  repost: '↻'
};
const AVATAR_COLORS = ['#1EFC8B', '#49C6FF', '#FFB000', '#FF5C5C', '#A37FFF'];

export default function EngagementCascade({
  stats,
  isActive = true,
  nodeCount
}: EngagementCascadeProps) {
  useEffect(() => {
    if (!isActive) return undefined;
    let index = 0;
    const timer = window.setInterval(() => {
      const pan = index % 5 / 2 - 1;
      void playEngagementPing(pan);
      index += 1;
    }, 480);

    return () => window.clearInterval(timer);
  }, [isActive]);

  const avatarCount = nodeCount ?? 18;
  const avatars = Array.from({ length: avatarCount }).map((_, index) => ({
    id: `avatar-${index}`,
    name: `viewer-${index}`,
    reaction: REACTION_TYPES[index % REACTION_TYPES.length],
    delay: index * 0.12
  }));
  const totalPredicted = stats.reduce((sum, item) => sum + item.predicted, 0);
  const totalActual = stats.reduce((sum, item) => sum + item.actual, 0);

  return (
    <div
      className={styles.container}
      data-testid="engagement-cascade"
      data-active={isActive}
    >
      <div className={styles.header}>ENGAGEMENT CASCADE</div>
      <div className={styles.avatarGrid} data-testid="engagement-avatars">
        {avatars.map((avatar, index) => (
          <div
            key={avatar.id}
            className={styles.avatarNode}
            data-reaction={avatar.reaction}
            style={{ '--index': index } as CSSProperties}
          >
            <Avatar
              size={30}
              name={avatar.name}
              variant="beam"
              colors={AVATAR_COLORS}
              className={styles.avatarSvg}
            />
            <span
              className={styles.avatarEmoji}
              data-reaction={avatar.reaction}
              style={{ animationDelay: `${avatar.delay}s` }}
              aria-hidden="true"
            >
              {REACTION_ICONS[avatar.reaction]}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.stats}>
        {stats.map((item, index) => (
          <div
            key={item.id}
            className={styles.statRow}
            style={{ animationDelay: `${index * 0.18}s` }}
          >
            <span className={styles.statLabel}>{item.label}</span>
            <span className={styles.predicted}>Pred {item.predicted}</span>
            <span className={styles.actual}>Actual {item.actual}</span>
          </div>
        ))}
      </div>
      <div className={styles.totals}>
        <span>Predicted Total</span>
        <span>{totalPredicted}</span>
        <span>Actual Total</span>
        <span>{totalActual}</span>
      </div>
    </div>
  );
}
