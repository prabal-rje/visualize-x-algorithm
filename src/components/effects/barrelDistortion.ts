const clampChannel = (value: number) =>
  Math.max(0, Math.min(255, Math.round(value)));

export type BarrelSample = {
  r: number;
  g: number;
};

export const computeBarrelSample = (
  x: number,
  y: number,
  size: number,
  strength: number
): BarrelSample => {
  const center = (size - 1) / 2;
  const dx = (x - center) / center;
  const dy = (y - center) / center;
  const distance = Math.min(1, Math.sqrt(dx * dx + dy * dy));
  const warp = distance * distance * strength;
  const r = clampChannel(128 + dx * 127 * warp);
  const g = clampChannel(128 + dy * 127 * warp);

  return { r, g };
};

export const createBarrelMapDataUri = (size: number, strength: number) => {
  const rects: string[] = [];

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const sample = computeBarrelSample(x, y, size, strength);
      rects.push(
        `<rect x="${x}" y="${y}" width="1" height="1" fill="rgb(${sample.r},${sample.g},128)"/>`
      );
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">${rects.join('')}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const BARREL_MAP_DATA_URI = createBarrelMapDataUri(32, 1);
