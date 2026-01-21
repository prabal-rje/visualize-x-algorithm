export interface CRTConfig {
  power: boolean;
  curvature: number;
  scanlineIntensity: number;
  vignetteIntensity: number;
  noiseIntensity: number;
  phosphorDecay: number; // Controls the trail length (0.1 = long trails, 0.9 = short)
  chromaticAberration: number;
  brightness: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  hue: number;
}