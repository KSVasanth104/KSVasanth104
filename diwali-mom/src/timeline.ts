// All timings for the film, in frames at 30 fps (global frames).
// Edit here to retime scenes, captions or the palette switch.
// (Audio cues live in src/audio.ts and use the same global frames.)

export type SceneTiming = {
  id: string;
  name: string;
  start: number;
  end: number;
  /** Frames this scene dissolves in over the previous one (0 = hard cut). */
  fadeIn: number;
};

export const SCENES: SceneTiming[] = [
  {id: '1', name: 'Scene 1 - Eating alone', start: 0, end: 90, fadeIn: 0},
  {id: '2', name: 'Scene 2 - The empty chair', start: 90, end: 210, fadeIn: 0},
  {id: '3', name: 'Scene 3 - Silent night', start: 210, end: 300, fadeIn: 15},
  {id: 'memory', name: 'Scene 3b - Memory: Diwali with her husband and son', start: 300, end: 450, fadeIn: 18},
  {id: 'tears', name: 'Scene 3c - Tears', start: 450, end: 510, fadeIn: 15},
  {id: '4', name: 'Scene 4 - Doorbell', start: 510, end: 630, fadeIn: 10},
  {id: '5', name: 'Scene 5 - Cooking montage', start: 630, end: 810, fadeIn: 10},
  {id: '6', name: 'Scene 6 - Eating together', start: 810, end: 960, fadeIn: 12},
  {id: '7', name: 'Scene 7 - The floor', start: 960, end: 1140, fadeIn: 12},
  {id: '8', name: 'Scene 8 - Pull back', start: 1140, end: 1320, fadeIn: 0},
];

/** Cold → warm palette crossfade (the door opens in scene 4). */
export const WARM_SWITCH = {start: 548, end: 592};

/** The memory briefly glows warm, then the present turns cold again. */
export const MEMORY_GLOW = {in: [284, 312], out: [436, 462], amount: 0.9};

/** Final fade to black before the end card. */
export const BLACKOUT = {start: 1230, end: 1264};

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
  {text: 'Once, this house', accent: 'was full of laughter.', start: 318, end: 442},
  {text: 'Diwali.', start: 564, end: 626, size: 150},
  {text: 'Same kitchen.', accent: 'Different taste.', start: 832, end: 952},
  {text: 'She slept\non the floor.', accent: 'And smiled.', start: 1038, end: 1136},
  {text: "Mothers don't cook\nfor taste.", accent: 'They cook for you.', start: 1242, end: 1330},
];

/**
 * Closing card after the film (44-54 s): a diya lights up, then the greeting and a
 * line that calls back to the doorbell in scene 4. `reveal` frames are relative
 * to the card's start.
 */
export const END_CARD = {
  start: 1320,
  end: 1620,
  greeting: 'Happy Diwali',
  line1: 'Go home this year.',
  line2: 'Someone has been\nwaiting by the door.',
  // synced to the Tamil end-card voice line (src/audio.ts, starts 30 frames into the card)
  reveal: {greeting: 34, line1: 118, line2: 197},
};
