// Mom's bedroom, front view (scene 7): the bed she makes up for her son,
// and the floor where she unrolls her own mat.
import React from 'react';
import {Palette} from '../theme';
import {Diya} from '../components/Diya';
import {FairyLights, Fireworks, MemorialPhoto, Toran, Window} from './Props';

export const BED_FRONT = {backY: 1150, frontY: 1210, x1: 330, x2: 1000, pillow: {x: 885, y: 1152}, floorY: 1400};

export const BedroomFront: React.FC<{
  p: Palette;
  frame: number;
  /** 1 = rumpled sheet, 0 = smoothed flat. */
  rumple: number;
  /** Pillow squash 0..1 while she plumps it. */
  squash: number;
  /** Character standing behind the bed. */
  behindBed?: React.ReactNode;
  /** The same character with layer="arms", so her hands rest on top of the bed. */
  overBed?: React.ReactNode;
  /** Things on the floor in front of the bed (mat, kneeling Mom). */
  floor?: React.ReactNode;
  id: string;
}> = ({p, frame, rumple, squash, behindBed, overBed, floor, id}) => {
  const {backY, frontY, x1, x2, pillow, floorY} = BED_FRONT;
  return (
    <g className="bedroom-front">
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.wallTop} />
          <stop offset="100%" stopColor={p.wallBottom} />
        </linearGradient>
      </defs>
      <rect x={-300} y={-400} width={1680} height={2000} fill={`url(#${id}-wall)`} />
      <Window x={80} y={620} w={230} h={270} p={p} id={`${id}-win`}>
        <Fireworks frame={frame} x={80} y={620} w={230} h={270} seed={9} />
      </Window>
      <Toran x1={50} x2={340} y={590} sag={18} scale={0.8} />
      <Diya x={150} y={922} scale={0.6} frame={frame} seed={2} id={`${id}-d1`} />
      <Diya x={250} y={922} scale={0.6} frame={frame} seed={6} id={`${id}-d2`} />
      <g transform="translate(700 650) scale(0.75) translate(-700 -650)">
        <MemorialPhoto x={700} y={650} p={p} />
      </g>
      <FairyLights x1={-40} x2={1120} y={140} sag={70} frame={frame} count={16} />

      {/* floor */}
      <rect x={-300} y={floorY} width={1680} height={900} fill={p.floor} />
      <rect x={-300} y={floorY - 14} width={1680} height={16} fill={p.wallTrim} />
      {[1460, 1560, 1700, 1890].map((yy) => (
        <line key={yy} x1={-300} y1={yy} x2={1380} y2={yy} stroke={p.floorLine} strokeWidth={3} opacity={0.5} />
      ))}

      {/* headboard */}
      <rect x={x2 - 10} y={980} width={60} height={440} rx={14} fill={p.woodDark} />
      <rect x={x2} y={995} width={40} height={30} rx={8} fill={p.wood} />

      {behindBed}

      {/* bed */}
      <ellipse cx={(x1 + x2) / 2} cy={1425} rx={400} ry={26} fill={p.shadow} opacity={0.35} />
      <rect x={x1 + 6} y={1300} width={22} height={122} rx={6} fill={p.woodDark} />
      <rect x={x2 - 30} y={1300} width={22} height={122} rx={6} fill={p.woodDark} />
      <rect x={x1 - 10} y={1290} width={x2 - x1 + 30} height={44} rx={8} fill={p.woodDark} />
      <path d={`M ${x1 + 20} ${backY} L ${x2 - 6} ${backY} L ${x2 + 10} ${frontY} L ${x1 - 16} ${frontY} Z`} fill={p.sheet} />
      <g opacity={rumple}>
        <path
          d={`M ${x1 + 60} ${backY + 18} q 60 -14 120 6 q 70 18 140 -4 M ${x1 + 150} ${backY + 40} q 80 10 160 -6 q 60 -12 130 8 M ${x1 + 360} ${backY + 20} q 50 14 120 0`}
          stroke={p.sheetShade}
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
        />
      </g>
      {/* bedcover hanging over the front */}
      <path
        d={`M ${x1 - 16} ${frontY} L ${x2 + 10} ${frontY} L ${x2 + 14} ${1392} Q ${(x1 + x2) / 2} ${1404 + rumple * 6} ${x1 - 20} ${1392} Z`}
        fill={p.fabric}
      />
      <path d={`M ${x1 - 18} 1372 Q ${(x1 + x2) / 2} 1384 ${x2 + 12} 1372`} stroke={p.accent} strokeWidth={6} fill="none" />
      <path
        d={`M ${x1 + 120} ${frontY + 6} Q ${x1 + 110} 1300 ${x1 + 124} 1394 M ${x2 - 140} ${frontY + 6} Q ${x2 - 130} 1300 ${x2 - 144} 1394`}
        stroke={p.fabricDark}
        strokeWidth={6}
        fill="none"
        opacity={0.5}
      />
      {/* pillow */}
      <g
        transform={`translate(${pillow.x} ${pillow.y + 30}) scale(${1 + squash * 0.1} ${1 - squash * 0.22}) translate(${-pillow.x} ${-pillow.y - 30})`}
      >
        <ellipse cx={pillow.x} cy={pillow.y} rx={100} ry={40} fill={p.sheetShade} />
        <ellipse cx={pillow.x - 4} cy={pillow.y - 5} rx={92} ry={33} fill={p.sheet} />
      </g>

      {overBed}
      {floor}
    </g>
  );
};

/** Straw mat on the floor, unrolled from `x1` to `rollX`. */
export const FloorMat: React.FC<{x1: number; rollX: number; y: number; p: Palette; rollR: number}> = ({x1, rollX, y, p, rollR}) => (
  <g className="mat">
    <path d={`M ${x1} ${y} L ${rollX} ${y} L ${rollX + 20} ${y + 80} L ${x1 - 20} ${y + 80} Z`} fill={p.woodLight} />
    {Array.from({length: Math.max(0, Math.floor((rollX - x1) / 36))}).map((_, i) => (
      <line key={i} x1={x1 + 18 + i * 36} y1={y + 4} x2={x1 + 10 + i * 36} y2={y + 76} stroke={p.wood} strokeWidth={3} opacity={0.6} />
    ))}
    <path
      d={`M ${x1} ${y + 10} L ${rollX} ${y + 10} M ${x1 - 16} ${y + 70} L ${rollX + 16} ${y + 70}`}
      stroke={p.accent2}
      strokeWidth={6}
      opacity={0.8}
    />
    {/* the roll */}
    <ellipse cx={rollX + 10} cy={y + 40} rx={rollR * 0.9} ry={rollR * 1.15} fill={p.woodLight} />
    <ellipse cx={rollX + 10} cy={y + 40} rx={rollR * 0.55} ry={rollR * 0.75} fill="none" stroke={p.wood} strokeWidth={4} />
    <ellipse cx={rollX + 10} cy={y + 40} rx={rollR * 0.22} ry={rollR * 0.32} fill="none" stroke={p.wood} strokeWidth={3} />
  </g>
);
