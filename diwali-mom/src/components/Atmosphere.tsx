import React from 'react';
import {AbsoluteFill} from 'remotion';
import {rand} from '../lib/anim';
import {GRADE, VIDEO} from '../theme';

/** Floating dust motes drifting slowly upward through the light. */
export const Dust: React.FC<{frame: number; color: string; count?: number; opacity?: number}> = ({
  frame,
  color,
  count = 46,
  opacity = 1,
}) => {
  const motes = [];
  for (let i = 0; i < count; i++) {
    const sx = rand(i * 3.1) * VIDEO.width;
    const sy = rand(i * 7.7) * VIDEO.height;
    const speed = 0.25 + rand(i * 1.3) * 0.6;
    const size = 1.5 + rand(i * 5.9) * 4.5;
    const y = ((((sy - frame * speed) % (VIDEO.height + 40)) + VIDEO.height + 40) % (VIDEO.height + 40)) - 20;
    const x = sx + Math.sin(frame / (40 + rand(i) * 50) + i) * 22;
    const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame / (18 + rand(i * 2.2) * 30) + i * 2));
    motes.push(<circle key={i} cx={x} cy={y} r={size} fill="url(#dust-grad)" opacity={tw} />);
  }
  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      <svg viewBox={`0 0 ${VIDEO.width} ${VIDEO.height}`} width={VIDEO.width} height={VIDEO.height}>
        <defs>
          <radialGradient id="dust-grad">
            <stop offset="0%" stopColor={color} stopOpacity={0.9} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </radialGradient>
        </defs>
        {motes}
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.6}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 75% 60% at 50% 52%, rgba(0,0,0,0) 45%, rgba(10,4,0,${strength}) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

/** Static paper grain for a hand-made, printed feel. */
export const Grain: React.FC<{opacity?: number; frame: number}> = ({opacity = 0.07, frame}) => {
  // shift the grain on every 3rd frame for a subtle "boil"
  const shift = (Math.floor(frame / 3) % 4) * 37;
  return (
    <AbsoluteFill style={{opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg viewBox={`0 0 ${VIDEO.width} ${VIDEO.height}`} width={VIDEO.width} height={VIDEO.height}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={shift} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

/** Colour grade overlays: cold blue wash → warm golden wash. */
export const GradeOverlay: React.FC<{warmth: number}> = ({warmth}) => (
  <>
    <AbsoluteFill
      style={{background: GRADE.cold.tint, mixBlendMode: 'color', opacity: (1 - warmth) * GRADE.cold.tintOpacity, pointerEvents: 'none'}}
    />
    <AbsoluteFill
      style={{background: GRADE.warm.tint, mixBlendMode: 'soft-light', opacity: warmth * GRADE.warm.tintOpacity, pointerEvents: 'none'}}
    />
  </>
);

export const gradeFilter = (warmth: number) => {
  const s = GRADE.cold.saturate + (GRADE.warm.saturate - GRADE.cold.saturate) * warmth;
  const b = GRADE.cold.brightness + (GRADE.warm.brightness - GRADE.cold.brightness) * warmth;
  return `saturate(${s.toFixed(3)}) brightness(${b.toFixed(3)})`;
};
