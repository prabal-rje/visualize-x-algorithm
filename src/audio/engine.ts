import * as Tone from 'tone';
import { useAudioStore } from '../stores/audio';

let initialized = false;
let crusher: Tone.BitCrusher | null = null;
let master: Tone.Gain | null = null;
let typewriter: Tone.Synth | null = null;
let chime: Tone.Synth | null = null;
let buzz: Tone.NoiseSynth | null = null;
let scoreSynth: Tone.Synth | null = null;
let pingSynth: Tone.Synth | null = null;
let pingPanner: Tone.Panner | null = null;
let drone: Tone.Oscillator | null = null;
let dataDrone: Tone.Oscillator | null = null;

function canUseAudio(): boolean {
  return typeof window !== 'undefined';
}

function shouldPlay(): boolean {
  const { enabled, muted } = useAudioStore.getState();
  return enabled && !muted;
}

function initNodes() {
  if (initialized || !canUseAudio()) return;

  master = new Tone.Gain(0.8).toDestination();
  crusher = new Tone.BitCrusher(4).connect(master);

  typewriter = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 0.015, sustain: 0, release: 0.01 },
    volume: -24
  }).connect(master); // bypass crusher for softer sound

  chime = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.005, decay: 0.12, sustain: 0, release: 0.08 }
  }).connect(crusher);

  buzz = new Tone.NoiseSynth({
    noise: { type: 'brown' },
    envelope: { attack: 0.005, decay: 0.1, sustain: 0, release: 0.05 }
  }).connect(crusher);

  scoreSynth = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.02 }
  }).connect(crusher);

  pingPanner = new Tone.Panner(0).connect(crusher);
  pingSynth = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.002, decay: 0.1, sustain: 0, release: 0.05 }
  }).connect(pingPanner);

  // CRT hum - layered frequencies for that "machine room" feel
  drone = new Tone.Oscillator({ frequency: 60, type: 'sine', volume: -20 }).connect(master);
  dataDrone = new Tone.Oscillator({ frequency: 120, type: 'triangle', volume: -24 }).connect(master);

  initialized = true;
}

async function ensureStarted(): Promise<boolean> {
  if (!canUseAudio()) return false;
  initNodes();
  if (Tone.getContext().state !== 'running') {
    try {
      await Tone.start();
    } catch (error) {
      console.warn('Audio context start blocked', error);
      return false;
    }
  }
  return true;
}

export async function startAudio() {
  if (!shouldPlay()) return;
  await ensureStarted();
}

export async function playTypewriterKey() {
  if (!shouldPlay()) return;
  if (!(await ensureStarted())) return;
  // Soft, low tick - gentle on ears
  const freq = 180 + Math.random() * 60;
  typewriter?.triggerAttackRelease(freq, '64n');
}

export async function playDataChirp() {
  if (!shouldPlay()) return;
  if (!(await ensureStarted())) return;
  const freq = 520 + Math.random() * 220;
  chime?.triggerAttackRelease(freq, '16n');
}

export async function playFilterPass() {
  if (!shouldPlay()) return;
  if (!(await ensureStarted())) return;
  chime?.triggerAttackRelease(1200, '8n');
}

export async function playFilterFail() {
  if (!shouldPlay()) return;
  if (!(await ensureStarted())) return;
  buzz?.triggerAttackRelease('16n');
}

export async function playScoreTick(intensity: number) {
  if (!shouldPlay()) return;
  if (!(await ensureStarted())) return;
  const freq = 360 + Math.min(1, Math.max(0, intensity)) * 520;
  scoreSynth?.triggerAttackRelease(freq, '32n');
}

export async function playEngagementPing(pan: number) {
  if (!shouldPlay()) return;
  if (!(await ensureStarted())) return;
  if (pingPanner) {
    pingPanner.pan.value = Math.max(-1, Math.min(1, pan));
  }
  pingSynth?.triggerAttackRelease(880, '16n');
}

export async function playChapterTransition() {
  if (!shouldPlay()) return;
  if (!(await ensureStarted())) return;
  buzz?.triggerAttackRelease('8n');
  chime?.triggerAttackRelease(1000, '8n');
}

export async function setAmbientDrone(active: boolean) {
  if (!shouldPlay()) return;
  if (!(await ensureStarted())) return;
  if (!drone) return;
  if (active && drone.state !== 'started') {
    drone.start();
  } else if (!active && drone.state === 'started') {
    drone.stop();
  }
}

export async function setDataDrone(active: boolean) {
  if (!shouldPlay()) return;
  if (!(await ensureStarted())) return;
  if (!dataDrone) return;
  if (active && dataDrone.state !== 'started') {
    dataDrone.start();
  } else if (!active && dataDrone.state === 'started') {
    dataDrone.stop();
  }
}
