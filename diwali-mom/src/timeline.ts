// All timings for the film, in frames at 30 fps (global frames).
// Edit here to retime scenes, captions or the palette switch.

export type SceneTiming = {
  id: number;
  name: string;
  start: number;
  end: number;
  /** Frames this scene dissolves in over the previous one (0 = hard cut). */
  fadeIn: number;
};

export const SCENES: SceneTiming[] = [
  {id: 1, name: 'Scene 1 - Eating alone', start: 0, end: 90, fadeIn: 0},
  {id: 2, name: 'Scene 2 - The empty chair', start: 90, end: 210, fadeIn: 0},
  {id: 3, name: 'Scene 3 - Silent night', start: 210, end: 330, fadeIn: 15},
  {id: 4, name: 'Scene 4 - Doorbell', start: 330, end: 450, fadeIn: 10},
  {id: 5, name: 'Scene 5 - Cooking montage', start: 450, end: 630, fadeIn: 10},
  {id: 6, name: 'Scene 6 - Eating together', start: 630, end: 780, fadeIn: 12},
  {id: 7, name: 'Scene 7 - The floor', start: 780, end: 960, fadeIn: 12},
  {id: 8, name: 'Scene 8 - Pull back', start: 960, end: 1140, fadeIn: 0},
];

/** Cold → warm palette crossfade (the door opens in scene 4). */
export const WARM_SWITCH = {start: 368, end: 412};

/** Final fade to black before the end card. */
export const BLACKOUT = {start: 1050, end: 1084};

export type CaptionCue = {
  /** Main line(s); use \n for a manual line break. */
  text: string;
  start: number;
  end: number;
  /** Optional second line rendered in the accent colour. */
  accent?: string;
  size?: number;
};

export const CAPTIONS: CaptionCue[] = [
  {text: 'Every night,', accent: 'the same quiet.', start: 6, end: 86},
  {text: 'No one to cook for.', start: 104, end: 200},
  {text: 'Diwali.', start: 384, end: 446, size: 150},
  {text: 'Same kitchen.', accent: 'Different taste.', start: 652, end: 772},
  {text: 'She slept\non the floor.', accent: 'And smiled.', start: 858, end: 956},
  {text: "Mothers don't cook\nfor taste.", accent: 'They cook for you.', start: 1062, end: 1150},
];

/**
 * Closing card after the film (38-48 s): a diya lights up, then the greeting and a
 * line that calls back to the doorbell in scene 4. `reveal` frames are relative
 * to the card's start.
 */
export const END_CARD = {
  start: 1140,
  end: 1440,
  greeting: 'Happy Diwali',
  line1: 'Go home this year.',
  line2: 'Someone has been\nwaiting by the door.',
  // synced to the Tamil end-card voice line (src/audio.ts, starts 30 frames into the card)
  reveal: {greeting: 34, line1: 118, line2: 197},
};
