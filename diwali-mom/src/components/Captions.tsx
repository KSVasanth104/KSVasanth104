import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {CaptionCue} from '../timeline';
import {FONT_FAMILY, mixPalette} from '../theme';
import {CLAMP, EASE_OUT} from '../lib/anim';

const FADE = 12;

/**
 * Large bold caption, centred in the top third with Shorts-safe margins
 * (90 px sides, kept clear of the top UI bar and the right-hand action buttons).
 */
const Caption: React.FC<{cue: CaptionCue; frame: number; warmth: number}> = ({cue, frame, warmth}) => {
  const local = frame - cue.start;
  const dur = cue.end - cue.start;
  const opacity = interpolate(local, [0, FADE, dur - FADE, dur], [0, 1, 1, 0], CLAMP);
  const rise = interpolate(local, [0, 22], [26, 0], {...CLAMP, easing: EASE_OUT});
  const blur = interpolate(local, [0, FADE], [8, 0], CLAMP);
  const p = mixPalette(warmth);
  const size = cue.size ?? 92;
  const accentColor = warmth > 0.5 ? '#ffc65a' : '#a9c4f0';
  const shadow = `0 4px 18px rgba(0,0,0,0.55), 0 0 42px ${p.textGlow}`;
  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        right: 90,
        top: 250,
        height: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        opacity,
        transform: `translateY(${rise}px)`,
        filter: `blur(${blur}px)`,
        fontFamily: `'${FONT_FAMILY}', 'Trebuchet MS', sans-serif`,
        fontWeight: 800,
        lineHeight: 1.08,
        whiteSpace: 'pre-line',
        letterSpacing: -0.5,
      }}
    >
      <div style={{fontSize: size, color: p.text, textShadow: shadow}}>{cue.text}</div>
      {cue.accent && <div style={{fontSize: size, color: accentColor, textShadow: shadow, marginTop: 6}}>{cue.accent}</div>}
    </div>
  );
};

export const Captions: React.FC<{cues: CaptionCue[]; frame: number; warmth: number}> = ({cues, frame, warmth}) => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    {cues
      .filter((c) => frame >= c.start && frame < c.end)
      .map((c) => (
        <Caption key={c.start} cue={c} frame={frame} warmth={warmth} />
      ))}
  </AbsoluteFill>
);
