// Front door seen from inside the house (scene 4).
import React from 'react';
import {FESTIVE, Palette} from '../theme';
import {keys} from '../lib/anim';
import {Diya, Glow} from '../components/Diya';
import {FairyLights, Fireworks, Toran, Window} from './Props';

export const DOOR = {x1: 430, x2: 860, top: 620, sill: 1560, handle: {x: 470, y: 1290}};

const Rangoli: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s} ${s * 0.32})`}>
    <circle r={120} fill={FESTIVE.rangoliPink} />
    <circle r={96} fill={FESTIVE.marigold} />
    {Array.from({length: 8}).map((_, i) => (
      <ellipse key={i} cx={0} cy={-62} rx={20} ry={36} fill={FESTIVE.rangoliBlue} transform={`rotate(${i * 45})`} />
    ))}
    <circle r={34} fill={FESTIVE.rangoliGreen} />
    <circle r={14} fill="#fff4dc" />
  </g>
);

export const Doorway: React.FC<{
  p: Palette;
  frame: number;
  warmth: number;
  /**
   * How festive the world OUTSIDE the door is (default: same as warmth). It is Diwali
   * out there all along, so scene 4 passes 1: opening the door lets the warmth in.
   */
  outsideWarmth?: number;
  /** Palette for the outside view (default: p). */
  pOut?: Palette;
  /** 0 closed → 1 swung open. */
  open: number;
  /** 0..1: rings around the doorbell. */
  ring: number;
  outside?: React.ReactNode;
  inside?: React.ReactNode;
  id: string;
}> = ({p, frame, warmth, outsideWarmth, pOut, open, ring, outside, inside, id}) => {
  const ow = outsideWarmth ?? warmth;
  const po = pOut ?? p;
  const {x1, x2, top, sill} = DOOR;
  const edge = x1 + (x2 - 45 - x1) * open;
  const k = open * 80;
  const handle = {x: edge + 40 * (1 - open), y: DOOR.handle.y};
  return (
    <g className="doorway">
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.wallTop} />
          <stop offset="100%" stopColor={p.wallBottom} />
        </linearGradient>
        <linearGradient id={`${id}-out`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={po.sky} />
          <stop offset="100%" stopColor={po.skyLow} />
        </linearGradient>
        <clipPath id={`${id}-opening`}>
          <rect x={x1} y={top} width={x2 - x1} height={sill - top} />
        </clipPath>
      </defs>

      <rect x={-300} y={-400} width={1680} height={2000} fill={`url(#${id}-wall)`} />
      <rect x={-300} y={1360} width={1680} height={200} fill={p.wallBottom} opacity={0.5} />

      {/* ---- outside, seen through the opening ---- */}
      <g clipPath={`url(#${id}-opening)`}>
        <rect x={x1} y={top} width={x2 - x1} height={sill - top} fill={`url(#${id}-out)`} />
        <g opacity={ow}>
          <Fireworks frame={frame} x={x1} y={top} w={x2 - x1} h={300} seed={3} />
        </g>
        {/* neighbouring houses */}
        <path
          d={`M ${x1} 1180 L 520 1180 L 520 1120 L 640 1060 L 760 1120 L 760 1200 L ${x2} 1200 L ${x2} 1440 L ${x1} 1440 Z`}
          fill={p.shadow}
          opacity={0.85}
        />
        {[
          [470, 1240],
          [600, 1150],
          [680, 1150],
          [790, 1260],
        ].map(([wx, wy], i) => (
          <rect key={i} x={wx} y={wy} width={34} height={40} rx={4} fill={FESTIVE.flameOuter} opacity={0.15 + ow * 0.75} />
        ))}
        <FairyLights x1={x1} x2={x2} y={1190} sag={40} frame={frame} count={10} opacity={ow} />
        {/* doorstep */}
        <rect x={x1} y={1420} width={x2 - x1} height={140} fill={po.floorFar} />
        <rect x={x1} y={1420} width={x2 - x1} height={10} fill={po.floorLine} opacity={0.5} />
        <g opacity={0.25 + ow * 0.75}>
          <Rangoli x={(x1 + x2) / 2} y={1505} s={0.9} />
        </g>
        <Diya x={482} y={1540} scale={0.5} frame={frame} seed={21} lit={keys(ow, [0.1, 0.5], [0, 1])} id={`${id}-ds1`} />
        <Diya x={808} y={1540} scale={0.5} frame={frame} seed={23} lit={keys(ow, [0.25, 0.65], [0, 1])} id={`${id}-ds2`} />
        {outside}
      </g>

      {/* ---- door frame and swinging door (hinged on the right) ---- */}
      <rect x={x1 - 34} y={top - 34} width={34} height={sill - top + 34} fill={p.woodDark} />
      <rect x={x2} y={top - 34} width={34} height={sill - top + 34} fill={p.woodDark} />
      <rect x={x1 - 34} y={top - 34} width={x2 - x1 + 68} height={34} fill={p.woodDark} />
      <g opacity={0.3 + warmth * 0.7}>
        <Toran x1={x1 - 30} x2={x2 + 30} y={top - 20} sag={30} />
      </g>
      <path d={`M ${edge} ${top - k} L ${x2} ${top} L ${x2} ${sill} L ${edge} ${sill + k} Z`} fill={open > 0.02 ? p.woodDark : p.wood} />
      {open < 0.98 && (
        <g>
          {[0, 1].map((r) => {
            const yA = top + 70 + r * 440;
            const yB = yA + 340;
            const inset = 40 * (1 - open * 0.6);
            const lx = edge + inset;
            const rx = x2 - 40;
            return (
              <path
                key={r}
                d={`M ${lx} ${yA - k * 0.6} L ${rx} ${yA} L ${rx} ${yB} L ${lx} ${yB + k * 0.2} Z`}
                fill={p.woodLight}
                opacity={0.35 * (1 - open)}
              />
            );
          })}
          <circle cx={handle.x} cy={handle.y} r={11} fill={p.accent} opacity={1 - open} />
        </g>
      )}

      {/* doorbell with rings */}
      <g transform="translate(920 1080)">
        <rect x={-18} y={-26} width={36} height={52} rx={8} fill={p.wallTrim} />
        <circle r={10} fill={p.accent} />
        {ring > 0 &&
          [0, 1, 2].map((i) => {
            const t = (ring * 2.2 + i * 0.33) % 1;
            return (
              <path
                key={i}
                d={`M ${30 + t * 60} ${-40 - t * 30} Q ${60 + t * 80} 0 ${30 + t * 60} ${40 + t * 30}`}
                stroke={p.text}
                strokeWidth={6}
                strokeLinecap="round"
                fill="none"
                opacity={(1 - t) * (ring < 0.85 ? 1 : (1 - ring) / 0.15)}
              />
            );
          })}
      </g>

      {/* left window where the diyas light up */}
      <Window x={60} y={700} w={240} h={290} p={p} id={`${id}-win`} curtain={false}>
        <g opacity={warmth}>
          <Fireworks frame={frame + 20} x={60} y={700} w={240} h={290} seed={8} />
        </g>
      </Window>
      {[0, 1, 2].map((i) => (
        <Diya
          key={i}
          x={105 + i * 80}
          y={1024}
          scale={0.68}
          frame={frame}
          seed={i * 3 + 1}
          lit={keys(warmth, [0.15 + i * 0.22, 0.4 + i * 0.22], [0, 1])}
          id={`${id}-wd${i}`}
        />
      ))}

      {/* floor and the warm light spilling in through the door */}
      <rect x={-300} y={sill} width={1680} height={800} fill={p.floor} />
      <rect x={-300} y={sill - 12} width={1680} height={14} fill={p.wallTrim} />
      {[1640, 1760, 1930].map((yy) => (
        <line key={yy} x1={-300} y1={yy} x2={1380} y2={yy} stroke={p.floorLine} strokeWidth={3} opacity={0.5} />
      ))}
      <path d={`M ${x1} ${sill} L ${edge} ${sill} L ${edge + 220} 2100 L ${x1 - 260} 2100 Z`} fill={po.light} opacity={open * ow * 0.32} />
      <Glow x={(x1 + x2) / 2} y={1200} r={700} color={po.lightSoft} opacity={open * ow * 0.35} id={`${id}-spill`} />

      {inside}
    </g>
  );
};

export const doorHandleAt = (open: number) => {
  const edge = DOOR.x1 + (DOOR.x2 - 45 - DOOR.x1) * open;
  return {x: edge + 40 * (1 - open), y: DOOR.handle.y};
};
