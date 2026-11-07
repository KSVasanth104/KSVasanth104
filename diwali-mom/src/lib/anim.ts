import {Easing, interpolate, spring} from 'remotion';

export const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Soft "hand-animated" ease used across the film. */
export const EASE = Easing.bezier(0.45, 0, 0.2, 1);
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.5, 0, 0.75, 0);

/** Clamped interpolate between two frames with easing. */
export const tween = (f: number, range: [number, number], out: [number, number], easing: (t: number) => number = EASE) =>
  interpolate(f, range, out, {...CLAMP, easing});

/** Clamped multi-keyframe interpolate; easing applies to each segment. */
export const keys = (f: number, input: number[], output: number[], easing: (t: number) => number = EASE) =>
  interpolate(f, input, output, {...CLAMP, easing});

/** Spring that starts at `start` (returns 0 before it). */
export const pop = (f: number, start: number, damping = 11, stiffness = 140) =>
  spring({frame: Math.max(0, f - start), fps: 30, config: {damping, stiffness, mass: 0.6}});

/** Gentle springy settle, for camera moves and arm gestures. */
export const settle = (f: number, start: number, durationInFrames = 30) =>
  spring({frame: Math.max(0, f - start), fps: 30, durationInFrames, config: {damping: 200}});

export const wave = (f: number, period: number, phase = 0) => Math.sin((f / period) * Math.PI * 2 + phase);

/** Organic flame flicker in roughly -1..1 (sum of incommensurate sines). */
export const flicker = (f: number, seed = 0) =>
  0.5 * Math.sin(f * 0.53 + seed * 1.7) + 0.3 * Math.sin(f * 1.37 + seed * 3.1) + 0.2 * Math.sin(f * 2.91 + seed * 5.3);

/** Eye openness for automatic blinking: 1 = open, 0 = closed. */
export const blink = (f: number, seed = 0, period = 96) => {
  const t = (((f + seed * 41) % period) + period) % period;
  if (t < 7) return Math.abs(t - 3.5) / 3.5;
  return 1;
};

/** Breathing cycle in -1..1 (about 13 breaths a minute). */
export const breath = (f: number, seed = 0, speed = 1) => Math.sin((f / 30) * Math.PI * 2 * 0.22 * speed + seed);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const mixPt = (a: {x: number; y: number}, b: {x: number; y: number}, t: number) => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
});

/** Deterministic pseudo random in 0..1. */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
