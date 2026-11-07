import React, {useId} from 'react';
import type {Pt} from './Arm';

export type FacePose = {
  /** -1 (frown) .. 1 (big smile). */
  smile?: number;
  /** 0 (closed) .. 1 (wide open, laughing). */
  open?: number;
  /** Manual eye openness (multiplied with automatic blinking). */
  eyeOpen?: number;
  /** How closed eyes are drawn: happy ∩ arcs or sleepy ∪ arcs. */
  closedStyle?: 'happy' | 'sleep';
  /** Pupil direction, each axis -1..1. */
  look?: Pt;
  /** Brow raise -1..1. */
  brow?: number;
  /** Worried/sad brows 0..1 (inner corners lift). */
  sad?: number;
  /** Smiling squint 0..1. */
  squint?: number;
  /** Extra eye sparkle 0..1 ("face lights up"). */
  sparkle?: number;
  /** Turn off automatic blinking. */
  noBlink?: boolean;
  /** Teary shine 0..1. */
  tears?: number;
};

const safeId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, '');

export const Eye: React.FC<{
  x: number;
  y: number;
  rx: number;
  ry: number;
  open: number;
  look: Pt;
  squint: number;
  sparkle: number;
  tears: number;
  closedStyle: 'happy' | 'sleep';
  color: string;
  lineColor: string;
}> = ({x, y, rx, ry, open, look, squint, sparkle, tears, closedStyle, color, lineColor}) => {
  if (open < 0.16) {
    const d =
      closedStyle === 'happy'
        ? `M ${x - rx * 1.5} ${y + 3} Q ${x} ${y - 7} ${x + rx * 1.5} ${y + 3}`
        : `M ${x - rx * 1.5} ${y} Q ${x} ${y + 6} ${x + rx * 1.5} ${y}`;
    return <path d={d} stroke={color} strokeWidth={3.6} strokeLinecap="round" fill="none" />;
  }
  const cx = x + look.x * rx * 0.5;
  const cy = y + look.y * ry * 0.3 + squint * 2;
  const h = ry * open * (1 - squint * 0.42);
  return (
    <g className="eye">
      <ellipse cx={cx} cy={cy} rx={rx} ry={h} fill={color} />
      <circle cx={cx + rx * 0.32} cy={cy - h * 0.38} r={rx * 0.36 * (1 + sparkle * 0.45)} fill="#fff" opacity={0.95} />
      {sparkle > 0.05 && <circle cx={cx - rx * 0.35} cy={cy + h * 0.35} r={rx * 0.2 * sparkle} fill="#fff" opacity={0.85} />}
      {tears > 0.05 && (
        <path
          d={`M ${cx - rx * 1.1} ${cy + h * 0.9} Q ${cx} ${cy + h * 1.35} ${cx + rx * 1.1} ${cy + h * 0.9}`}
          stroke="#e8f6ff"
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
          opacity={tears * 0.9}
        />
      )}
      {squint > 0.1 && (
        <path
          d={`M ${cx - rx * 1.3} ${cy + h * 0.9 + 1} Q ${cx} ${cy + h * 0.2} ${cx + rx * 1.3} ${cy + h * 0.9 + 1}`}
          stroke={lineColor}
          strokeWidth={2.4}
          strokeLinecap="round"
          fill="none"
          opacity={squint * 0.8}
        />
      )}
    </g>
  );
};

export const Brow: React.FC<{x: number; y: number; w: number; side: 1 | -1; raise: number; sad: number; color: string; thick: number}> = ({
  x,
  y,
  w,
  side,
  raise,
  sad,
  color,
  thick,
}) => {
  const yy = y - raise * 6;
  // outer end at x + side*w/2, inner end at x - side*w/2
  const outer = {x: x + side * w * 0.5, y: yy + 3 + sad * 2};
  const inner = {x: x - side * w * 0.5, y: yy + 2 - sad * 7};
  const mid = {x, y: yy - 4 - raise * 1.5};
  return (
    <path
      d={`M ${outer.x} ${outer.y} Q ${mid.x} ${mid.y} ${inner.x} ${inner.y}`}
      stroke={color}
      strokeWidth={thick}
      strokeLinecap="round"
      fill="none"
    />
  );
};

/** Filled mouth that morphs between frown, neutral, smile and laugh. */
export const Mouth: React.FC<{
  x: number;
  y: number;
  w: number;
  smile: number;
  open: number;
  color: string;
  tongue: string;
}> = ({x, y, w, smile, open, color, tongue}) => {
  const id = safeId(useId());
  const ww = w * (1 + Math.max(0, smile) * 0.25 + open * 0.1);
  const cy = -smile * 4.5 + open * 1;
  const upperMid = (smile > 0 ? smile * 1.2 : -smile * -1) - open * 3;
  const lowerMid = upperMid + 2.8 + Math.max(0, smile) * 6 + open * 17;
  const cu = 2 * upperMid - cy;
  const cl = 2 * lowerMid - cy;
  const d = `M ${-ww} ${cy} Q 0 ${cu} ${ww} ${cy} Q 0 ${cl} ${-ww} ${cy} Z`;
  return (
    <g className="mouth" transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={`m${id}`}>
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill={color} />
      {open > 0.2 && (
        <g clipPath={`url(#m${id})`}>
          <rect x={-ww} y={upperMid - 6} width={ww * 2} height={7 + open * 2} fill="#fbf6ee" />
          <ellipse cx={0} cy={lowerMid + 1} rx={ww * 0.6} ry={6 + open * 4} fill={tongue} />
        </g>
      )}
    </g>
  );
};
