// Soundtrack cue sheet: Tamil voice-over, South Indian score and sound effects.
// All `from` values are global frames (30 fps). Files live in public/audio/ and are
// produced from the raw ElevenLabs takes by scripts/prepare-audio.sh.
//
// `envelope` is a list of [localFrame, volume] keyframes (linear between points).
// Music is automatically ducked under the voice lines (see DUCK).

export type Envelope = [number, number][];

export type VoiceLine = {
  file: string;
  from: number;
  /** Length in frames (used for ducking the music). */
  length: number;
  volume: number;
  speaker: 'Narrator (Vennila)' | 'Son (Muthu)';
  tamil: string;
  english: string;
};

export const VOICE: VoiceLine[] = [
  {
    file: 'audio/vo/01_every_night.mp3',
    from: 12,
    length: 90,
    volume: 1,
    speaker: 'Narrator (Vennila)',
    tamil: 'ஒவ்வொரு ராத்திரியும்… அதே அமைதி.',
    english: 'Every night… the same quiet.',
  },
  {
    file: 'audio/vo/02_no_one_to_cook_for.mp3',
    from: 108,
    length: 107,
    volume: 1,
    speaker: 'Narrator (Vennila)',
    tamil: 'சமைச்சுப் போட… யாருமே இல்ல.',
    english: 'No one… to cook for.',
  },
  {
    file: 'audio/vo/02b_memory_laughter.mp3',
    from: 330,
    length: 108,
    volume: 1,
    speaker: 'Narrator (Vennila)',
    tamil: 'ஒரு காலத்துல… இந்த வீடு முழுக்க சிரிப்பு சத்தம் தான்.',
    english: 'Once… this whole house was full of laughter.',
  },
  {
    file: 'audio/vo/03_son_amma.mp3',
    from: 556,
    length: 47,
    volume: 1,
    speaker: 'Son (Muthu)',
    tamil: 'அம்மா!',
    english: 'Amma!',
  },
  {
    file: 'audio/vo/04_deepavali.mp3',
    from: 598,
    length: 44,
    volume: 1.1,
    speaker: 'Narrator (Vennila)',
    tamil: 'தீபாவளி.',
    english: 'Deepavali.',
  },
  {
    file: 'audio/vo/05_same_kitchen.mp3',
    from: 837,
    length: 104,
    volume: 1,
    speaker: 'Narrator (Vennila)',
    tamil: 'அதே சமையலறை… ஆனா ருசி வேற.',
    english: 'Same kitchen… but a different taste.',
  },
  {
    file: 'audio/vo/06_slept_on_floor.mp3',
    from: 1044,
    length: 114,
    volume: 1,
    speaker: 'Narrator (Vennila)',
    tamil: 'அவங்க தரையில தூங்கினாங்க… சிரிச்சுக்கிட்டே.',
    english: 'She slept on the floor… smiling.',
  },
  {
    file: 'audio/vo/07_mothers_cook_for_you.mp3',
    from: 1242,
    length: 114,
    volume: 1,
    speaker: 'Narrator (Vennila)',
    tamil: 'அம்மா சமைக்கிறது ருசிக்காக இல்ல… உனக்காக.',
    english: "A mother doesn't cook for taste… she cooks for you.",
  },
  {
    file: 'audio/vo/08_happy_deepavali.mp3',
    from: 1350,
    length: 246,
    volume: 1,
    speaker: 'Narrator (Vennila)',
    tamil: 'இனிய தீபாவளி நல்வாழ்த்துகள். இந்த வருஷம்… வீட்டுக்குப் போங்க. வாசல்லயே ஒருத்தங்க காத்துக்கிட்டு இருக்காங்க.',
    english: 'Happy Deepavali. This year… go home. Someone is waiting right at the door.',
  },
];

export type BedCue = {
  file: string;
  from: number;
  envelope: Envelope;
  duck?: boolean;
  label: string;
  /** Skip this many frames at the start of the file. */
  trimBefore?: number;
};

/** Score: three South Indian cues that follow the story's mood. */
export const MUSIC: BedCue[] = [
  {
    label: 'A - lonely veena + tanpura (scenes 1-3)',
    file: 'audio/music/a_lonely_veena.mp3',
    from: 0,
    // fades as she drifts into the memory
    envelope: [
      [0, 0],
      [20, 0.95],
      [276, 0.95],
      [312, 0],
    ],
    duck: true,
  },
  {
    label: 'memory - festive cue, muffled like a distant memory (scene 3b)',
    file: 'audio/music/memory_festive_muffled.mp3',
    from: 290,
    envelope: [
      [0, 0],
      [18, 0.85],
      [150, 0.85],
      [190, 0],
    ],
    duck: true,
  },
  {
    label: 'A (tail) - veena returns for the tears, silent before the doorbell (scene 3c)',
    file: 'audio/music/a_lonely_veena.mp3',
    from: 446,
    trimBefore: 165,
    envelope: [
      [0, 0],
      [14, 0.9],
      [48, 0.9],
      [62, 0],
    ],
    duck: true,
  },
  {
    label: 'B - festive nadaswaram + thavil (door opens → eating together)',
    file: 'audio/music/b_festive_nadaswaram.mp3',
    from: 549,
    envelope: [
      [0, 0],
      [8, 0.58],
      [420, 0.58],
      [456, 0],
    ],
    duck: true,
  },
  {
    label: 'C - tender flute + veena (bed, floor, end card)',
    file: 'audio/music/c_tender_flute.mp3',
    from: 960,
    envelope: [
      [0, 0],
      [30, 0.46],
      [660, 0.46],
    ],
    duck: true,
  },
];

export const SFX: BedCue[] = [
  {
    label: 'quiet night: wall clock + crickets',
    file: 'audio/sfx/night_clock_crickets.mp3',
    from: 0,
    envelope: [
      [0, 0.35],
      [286, 0.35],
      [316, 0],
    ],
  },
  {
    label: 'memory: sparklers, flowerpot whoosh, family laughing',
    file: 'audio/sfx/memory_sparklers_laughter.mp3',
    from: 318,
    envelope: [
      [0, 0.9],
      [130, 0.9],
      [160, 0],
    ],
  },
  {
    label: 'quiet night returns for the tears',
    file: 'audio/sfx/night_clock_crickets.mp3',
    from: 440,
    envelope: [
      [0, 0],
      [20, 0.35],
      [70, 0.35],
      [100, 0],
    ],
  },
  {label: 'doorbell', file: 'audio/sfx/doorbell.mp3', from: 510, envelope: [[0, 0.9]]},
  {
    label: 'distant Diwali crackers',
    file: 'audio/sfx/distant_crackers.mp3',
    from: 580,
    envelope: [
      [0, 0],
      [30, 0.28],
      [540, 0.28],
      [600, 0],
    ],
  },
];

/** Music volume multiplier while someone is speaking, and the ramp length in frames. */
export const DUCK = {amount: 0.55, ramp: 8};
