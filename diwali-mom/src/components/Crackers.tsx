// Diwali crackers drawn procedurally: a flowerpot (pusvanam) fountain and a
// handheld sparkler (kambi mathappu) with a light trail. Deterministic per frame.
import React from 'react';
import {FESTIVE} from '../theme';
import {flicker, rand} from '../lib/anim';
import {Glow} from './Diya';
import type {Pt} from '../rig/Arm';

/** Clay flowerpot that erupts into a fountain of golden sparks at `ignite`. */
export const Flowerpot: React.FC<{x: number; y: number; frame: number; ignite: number; scale?: number; id: string}> = ({
  x,
  y,
  frame,
  ignite,
  scale = 1,
  id,
}) => {
  const t = frame - ignite;
  const power = t < 0 ? 0 : Math.min(1, t / 8);
  const sparks = [];
  if (t >= 0) {
    const LIFE = 34;
    for (let i = 0; i < 140; i++) {
      const age = ((t * 1.0 + rand(i * 3.3) * LIFE) % LIFE) + 0.001;
      if (age > t + 0.5) continue; // not born yet right after ignition
      const vx = (rand(i * 1.7) - 0.5) * 11;
      const vy = -(20 + rand(i * 2.9) * 14) * power;
      const px = vx * age;
      const py = vy * age + 0.62 * age * age;
      if (py > 0) continue;
      const life = 1 - age / LIFE;
      const c = i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? FESTIVE.flame : FESTIVE.fireworkA;
      sparks.push(
        <line
          key={i}
          x1={px}
          y1={py}
          x2={px - vx * 0.9}
          y2={py - (vy + 1.1 * age) * 0.9}
          stroke={c}
          strokeWidth={2.5 + life * 3.5}
          strokeLinecap="round"
          opacity={0.25 + life * 0.75}
        />,
      );
    }
  }
  const f = flicker(frame, 7);
  return (
    <g className="flowerpot" transform={`translate(${x} ${y}) scale(${scale})`}>
      {power > 0 && <Glow x={0} y={-220} r={620} color={FESTIVE.flameOuter} opacity={(0.75 + f * 0.12) * power} id={`${id}-glow`} />}
      {sparks}
      {power > 0 && <ellipse cx={0} cy={-18} rx={14 + f * 3} ry={22 + f * 4} fill="#fffbe8" opacity={power} />}
      <path d="M -26 0 L -12 -40 L 12 -40 L 26 0 Z" fill={FESTIVE.clay} />
      <path d="M -16 -26 L 16 -26" stroke={FESTIVE.clayDark} strokeWidth={5} />
      <ellipse cx={0} cy={0} rx={27} ry={6} fill={FESTIVE.clayDark} />
    </g>
  );
};

/** Burst of sparks at a point (the head of a sparkler). */
const SparkBurst: React.FC<{at: Pt; frame: number; size: number; seed: number}> = ({at, frame, size, seed}) => {
  const rays = [];
  for (let i = 0; i < 26; i++) {
    const a = rand(frame * 13.1 + i * 7.7 + seed) * Math.PI * 2;
    const len = size * (0.3 + rand(frame * 5.3 + i * 3.1 + seed) * 0.9);
    const ex = at.x + Math.cos(a) * len;
    const ey = at.y + Math.sin(a) * len;
    rays.push(
      <g key={i}>
        <line
          x1={at.x}
          y1={at.y}
          x2={ex}
          y2={ey}
          stroke={i % 4 ? FESTIVE.flame : '#ffffff'}
          strokeWidth={1.8}
          strokeLinecap="round"
          opacity={0.85}
        />
        {i % 3 === 0 && (
          <path
            d={`M ${ex} ${ey} l ${Math.cos(a + 0.8) * 7} ${Math.sin(a + 0.8) * 7} M ${ex} ${ey} l ${Math.cos(a - 0.8) * 7} ${Math.sin(a - 0.8) * 7}`}
            stroke={FESTIVE.fireworkA}
            strokeWidth={1.6}
            strokeLinecap="round"
          />
        )}
      </g>,
    );
  }
  return <g>{rays}</g>;
};

/**
 * Handheld sparkler: wire from `hand` to `tip`, a crackling burst at the tip and a
 * fading light trail through the previous tip positions (`trail`, newest first).
 */
export const Sparkler: React.FC<{hand: Pt; tip: Pt; trail: Pt[]; frame: number; id: string; seed?: number}> = ({
  hand,
  tip,
  trail,
  frame,
  id,
  seed = 0,
}) => (
  <g className="sparkler">
    <Glow x={tip.x} y={tip.y} r={200} color={FESTIVE.flameOuter} opacity={0.6 + flicker(frame, seed) * 0.1} id={`${id}-glow`} />
    {trail.map((p, i) => {
      const q = i === 0 ? tip : trail[i - 1];
      return (
        <line
          key={i}
          x1={q.x}
          y1={q.y}
          x2={p.x}
          y2={p.y}
          stroke={FESTIVE.flame}
          strokeWidth={9 - i * 0.7}
          strokeLinecap="round"
          opacity={(1 - i / trail.length) * 0.75}
        />
      );
    })}
    <line x1={hand.x} y1={hand.y} x2={tip.x} y2={tip.y} stroke="#8b8f98" strokeWidth={4} strokeLinecap="round" />
    <SparkBurst at={tip} frame={frame} size={46} seed={seed} />
    <circle cx={tip.x} cy={tip.y} r={7} fill="#fffef4" />
  </g>
);

/** Incense stick (used to light crackers) with a glowing tip. */
export const IncenseStick: React.FC<{hand: Pt; tip: Pt; frame: number}> = ({hand, tip, frame}) => (
  <g className="incense">
    <line x1={hand.x} y1={hand.y} x2={tip.x} y2={tip.y} stroke="#6b3b22" strokeWidth={4} strokeLinecap="round" />
    <circle cx={tip.x} cy={tip.y} r={5 + flicker(frame, 3) * 1.2} fill="#ff6a2a" />
    <circle cx={tip.x} cy={tip.y} r={12} fill="#ff8a3a" opacity={0.35} />
    <path
      d={`M ${tip.x} ${tip.y} q ${6 + Math.sin(frame / 7) * 6} -20 0 -40 q -8 -18 ${4 + Math.sin(frame / 9) * 4} -40`}
      stroke="#ffffff"
      strokeWidth={2.5}
      fill="none"
      opacity={0.35}
    />
  </g>
);
