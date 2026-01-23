/**
 * Simple SVG avatar for Firefox only (boring-avatars crashes due to useId).
 */

type SimpleAvatarProps = {
  name: string;
  size?: number;
  colors?: string[];
  className?: string;
};

const DEFAULT_COLORS = ['#1EFC8B', '#49C6FF', '#FFB000', '#FF5C5C', '#A37FFF'];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function getColor(name: string, index: number, colors: string[]): string {
  return colors[hashCode(name + index) % colors.length];
}

export default function SimpleAvatar({
  name,
  size = 40,
  colors = DEFAULT_COLORS,
  className
}: SimpleAvatarProps) {
  const hash = hashCode(name);
  const bgColor = getColor(name, 0, colors);
  const faceColor = getColor(name, 1, colors);
  const spotColor = getColor(name, 2, colors);
  const rotate = (hash % 360) - 180;
  const tx = (hash % 8) - 4;
  const ty = ((hash >> 4) % 8) - 4;

  return (
    <svg
      viewBox="0 0 36 36"
      fill="none"
      width={size}
      height={size}
      className={className}
    >
      <rect width="36" height="36" fill={bgColor} rx="18" />
      <g transform={`rotate(${rotate} 18 18)`}>
        <circle cx={18 + tx / 2} cy={18 + ty / 2} r="10" fill={faceColor} />
        <circle cx={24 + tx} cy={12 + ty} r="4" fill={spotColor} />
      </g>
    </svg>
  );
}
