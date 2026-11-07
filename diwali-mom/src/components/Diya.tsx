import React from 'react';
import {FESTIVE} from '../theme';
import {flicker} from '../lib/anim';

/** Soft radial glow, used by diyas, bulbs and window light. */
export const Glow: React.FC<{x: number; y: number; r: number; color: string; opacity: number; id: string}> = ({
  x,
  y,
  r,
  color,
  opacity,
  id,
}) => (
  <g>
    <defs>
      <radialGradient id={id}>
        <stop offset="0%" stopColor={color} stopOpacity={0.9} />
        <stop offset="35%" stopColor={color} stopOpacity={0.35} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id})`} opacity={opacity} />
  </g>
);

/**
 * Clay oil lamp with a flickering flame and glow.
 * `lit` 0..1 grows the flame in (used when the diyas ignite in scene 4).
 */
export const Diya: React.FC<{
  x: number;
  y: number;
  scale?: number;
  frame: number;
  seed?: number;
  lit?: number;
  glow?: number;
  id: string;
}> = ({x, y, scale = 1, frame, seed = 0, lit = 1, glow = 1, id}) => {
  const n = flicker(frame, seed);
  const n2 = flicker(frame + 13, seed + 4);
  const fh = (1 + n * 0.16) * lit;
  const sway = n2 * 5;
  return (
    <g className="diya" transform={`translate(${x} ${y}) scale(${scale})`}>
      {lit > 0 && (
        <Glow x={0} y={-30} r={150 * (1 + n * 0.06)} color={FESTIVE.flameOuter} opacity={(0.55 + n * 0.12) * lit * glow} id={`${id}-g`} />
      )}
      {/* clay bowl */}
      <path d="M -40 -8 Q 0 34 40 -8 Q 30 -16 0 -16 Q -30 -16 -40 -8 Z" fill={FESTIVE.clay} />
      <path d="M -40 -8 Q 0 0 40 -8 Q 30 -18 0 -18 Q -30 -18 -40 -8 Z" fill={FESTIVE.clayDark} />
      <path d="M 34 -12 Q 52 -18 50 -24 Q 40 -20 30 -14 Z" fill={FESTIVE.clay} />
      <path d="M -26 4 Q 0 20 26 4" stroke="#d8783f" strokeWidth={3} fill="none" opacity={0.7} />
      {/* wick and flame */}
      <path d="M 40 -18 L 44 -26" stroke="#3b2414" strokeWidth={3} strokeLinecap="round" />
      {lit > 0 && (
        <g transform={`translate(44 -24) scale(${0.9 + lit * 0.1} ${fh})`}>
          <path d={`M 0 0 C -13 -8 -10 -26 ${sway} -48 C 10 -26 13 -8 0 0 Z`} fill={FESTIVE.flameOuter} />
          <path d={`M 0 -2 C -7 -8 -6 -20 ${sway * 0.7} -34 C 6 -20 7 -8 0 -2 Z`} fill={FESTIVE.flame} />
          <ellipse cx={0} cy={-8} rx={3.5} ry={6} fill={FESTIVE.flameCore} />
        </g>
      )}
    </g>
  );
};
