export type CRTConfig = {
  power: boolean;
  phosphorIntensity: number;
  scanlineIntensity: number;
  chromaticAberration: number;
  noiseIntensity: number;
  vignetteIntensity: number;
  brightness: number;
};

export const DEFAULT_CRT_CONFIG: CRTConfig = {
  power: true,
  phosphorIntensity: 0.7,
  scanlineIntensity: 0.25,
  chromaticAberration: 0.6,
  noiseIntensity: 0.6,
  vignetteIntensity: 0.6,
  brightness: 1.05
};
