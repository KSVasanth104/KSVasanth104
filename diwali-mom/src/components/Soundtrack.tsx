import React from 'react';
import {Audio, interpolate, Sequence, staticFile} from 'remotion';
import {BedCue, DUCK, Envelope, MUSIC, SFX, VOICE} from '../audio';

const envelopeAt = (env: Envelope, f: number) =>
  env.length === 1
    ? env[0][1]
    : interpolate(
        f,
        env.map((e) => e[0]),
        env.map((e) => e[1]),
        {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
      );

/** 1 when nobody speaks, DUCK.amount while a voice line plays (smooth ramps). */
const duckAt = (globalFrame: number) => {
  let gain = 1;
  for (const v of VOICE) {
    const g = interpolate(
      globalFrame,
      [v.from - DUCK.ramp, v.from, v.from + v.length, v.from + v.length + DUCK.ramp * 2],
      [1, DUCK.amount, DUCK.amount, 1],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
    );
    gain = Math.min(gain, g);
  }
  return gain;
};

const Bed: React.FC<{cue: BedCue}> = ({cue}) => (
  <Sequence name={`♪ ${cue.label}`} from={cue.from} layout="none">
    <Audio
      src={staticFile(cue.file)}
      trimBefore={cue.trimBefore}
      volume={(f) => envelopeAt(cue.envelope, f) * (cue.duck ? duckAt(cue.from + f) : 1)}
    />
  </Sequence>
);

/** Tamil voice-over + South Indian score + SFX, laid out from the cue sheet in src/audio.ts. */
export const Soundtrack: React.FC = () => (
  <>
    {MUSIC.map((c) => (
      <Bed key={c.label} cue={c} />
    ))}
    {SFX.map((c) => (
      <Bed key={c.label} cue={c} />
    ))}
    {VOICE.map((v) => (
      <Sequence key={v.file} name={`🎙 ${v.english}`} from={v.from} layout="none">
        <Audio src={staticFile(v.file)} volume={v.volume} />
      </Sequence>
    ))}
  </>
);
