// Small Indian home kitchen, front view (scene 5).
import React from 'react';
import {FESTIVE, Palette} from '../theme';
import {flicker} from '../lib/anim';
import {Diya} from '../components/Diya';
import {Fireworks, Toran, Window} from './Props';

export const KITCHEN = {counterTop: 1290, counterFront: 1340};

export const Kitchen: React.FC<{
  p: Palette;
  frame: number;
  /** Characters standing behind the counter. */
  children?: React.ReactNode;
  /** Things on the counter, in front of the characters. */
  front?: React.ReactNode;
  id: string;
}> = ({p, frame, children, front, id}) => (
  <g className="kitchen">
    <defs>
      <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={p.wallTop} />
        <stop offset="100%" stopColor={p.wallBottom} />
      </linearGradient>
    </defs>
    <rect x={-300} y={-400} width={1680} height={2000} fill={`url(#${id}-wall)`} />

    {/* tiled backsplash */}
    <rect x={-300} y={860} width={1680} height={440} fill={p.wallDeco} />
    {Array.from({length: 26}).map((_, i) => (
      <line key={`v${i}`} x1={-300 + i * 70} y1={860} x2={-300 + i * 70} y2={1300} stroke={p.wallBottom} strokeWidth={3} opacity={0.5} />
    ))}
    {Array.from({length: 7}).map((_, i) => (
      <line key={`h${i}`} x1={-300} y1={860 + i * 70} x2={1380} y2={860 + i * 70} stroke={p.wallBottom} strokeWidth={3} opacity={0.5} />
    ))}

    <Window x={70} y={560} w={240} h={250} p={p} id={`${id}-win`} curtain={false}>
      <Fireworks frame={frame} x={70} y={560} w={240} h={250} seed={5} />
    </Window>
    <Toran x1={40} x2={340} y={530} sag={18} scale={0.8} />
    <Diya x={190} y={862} scale={0.6} frame={frame} seed={14} id={`${id}-wdiya`} />

    {/* shelf with steel dabbas and spice jars */}
    <rect x={560} y={700} width={480} height={22} rx={4} fill={p.wood} />
    <path d="M 600 722 L 620 760 M 1000 722 L 980 760" stroke={p.woodDark} strokeWidth={8} />
    {[
      [600, 80],
      [670, 104],
      [740, 70],
    ].map(([x, h]) => (
      <g key={x}>
        <rect x={x - 30} y={700 - h} width={60} height={h} rx={6} fill={p.steel} />
        <ellipse cx={x} cy={700 - h} rx={30} ry={7} fill={p.steelDark} />
        <rect x={x - 22} y={700 - h + 10} width={8} height={h - 20} fill="#ffffff" opacity={0.3} />
      </g>
    ))}
    {[
      [830, FESTIVE.dal],
      [900, '#c0392b'],
      [970, FESTIVE.sabzi],
    ].map(([x, c]) => (
      <g key={x as number}>
        <rect x={(x as number) - 24} y={630} width={48} height={70} rx={10} fill="#ffffff" opacity={0.35} />
        <rect x={(x as number) - 20} y={650} width={40} height={46} rx={8} fill={c as string} />
        <rect x={(x as number) - 18} y={622} width={36} height={12} rx={4} fill={p.woodDark} />
      </g>
    ))}
    {/* hanging ladles */}
    <rect x={640} y={900} width={360} height={10} rx={5} fill={p.steelDark} />
    {[680, 760, 840, 920].map((x, i) => (
      <g key={x} transform={`rotate(${flicker(frame, i) * 1.5} ${x} 905)`}>
        <rect x={x - 4} y={905} width={8} height={110 + (i % 2) * 30} rx={4} fill={p.steel} />
        <ellipse cx={x} cy={1020 + (i % 2) * 30} rx={20} ry={14} fill={p.steelDark} />
      </g>
    ))}

    {children}

    {/* counter */}
    <path d="M -300 1290 L 1380 1290 L 1380 1342 L -300 1342 Z" fill={p.woodLight} />
    <rect x={-300} y={1290} width={1680} height={6} fill="#ffffff" opacity={0.15} />
    <rect x={-300} y={1342} width={1680} height={28} fill={p.woodDark} />
    <rect x={-300} y={1370} width={1680} height={700} fill={p.wood} />
    {[-200, 140, 480, 820, 1160].map((x) => (
      <g key={x}>
        <rect x={x + 20} y={1410} width={300} height={440} rx={14} fill={p.woodDark} opacity={0.35} />
        <rect x={x + 150} y={1440} width={40} height={12} rx={6} fill={p.accent} />
      </g>
    ))}
    {front}
  </g>
);

/** Iron kadai with bubbling halwa and rising steam. */
export const Kadai: React.FC<{x: number; y: number; frame: number; p: Palette}> = ({x, y, frame, p}) => (
  <g className="kadai">
    {[0, 1, 2].map((i) => {
      const t = ((frame + i * 20) % 60) / 60;
      const sx = x - 50 + i * 50 + Math.sin(frame / 9 + i) * 10;
      return (
        <path
          key={i}
          d={`M ${sx} ${y - 30 - t * 180} q 18 -30 0 -60 q -18 -30 0 -60`}
          stroke="#ffffff"
          strokeWidth={10}
          strokeLinecap="round"
          fill="none"
          opacity={(1 - t) * t * 1.6 * 0.5}
        />
      );
    })}
    <rect x={x - 170} y={y + 10} width={340} height={26} rx={8} fill="#2a2420" />
    <ellipse cx={x - 150} cy={y - 18} rx={22} ry={12} fill="none" stroke="#3a332e" strokeWidth={8} />
    <ellipse cx={x + 150} cy={y - 18} rx={22} ry={12} fill="none" stroke="#3a332e" strokeWidth={8} />
    <path d={`M ${x - 140} ${y - 22} Q ${x} ${y + 70} ${x + 140} ${y - 22} Z`} fill="#3a332e" />
    <ellipse cx={x} cy={y - 22} rx={140} ry={24} fill="#2b2522" />
    <ellipse cx={x} cy={y - 20} rx={124} ry={18} fill={FESTIVE.laddoo} />
    {[0, 1, 2, 3].map((i) => {
      const t = ((frame + i * 11) % 30) / 30;
      return <circle key={i} cx={x - 70 + i * 45} cy={y - 22} r={4 + t * 6} fill={FESTIVE.laddooShade} opacity={1 - t} />;
    })}
    <path d={`M ${x - 110} ${y + 4} Q ${x} ${y + 40} ${x + 110} ${y + 4}`} stroke={p.light} strokeWidth={4} fill="none" opacity={0.25} />
  </g>
);
