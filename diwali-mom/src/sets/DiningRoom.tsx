import React from 'react';
import {Palette} from '../theme';
import {Diya} from '../components/Diya';
import {
  Bowl,
  Bulb,
  Chair,
  Fireworks,
  FairyLights,
  Laddoo,
  Jalebi,
  MemorialPhoto,
  Moon,
  Petals,
  PuriStack,
  RiceMound,
  SteelPlate,
  Toran,
  Tumbler,
  WallClock,
  Window,
} from './Props';

/** World layout constants so scenes can place characters and aim the camera. */
export const DINING = {
  floorY: 1250,
  tableBack: 1205,
  tableFront: 1255,
  momX: 340,
  sonX: 740,
  seatFloorY: 1515,
  chairX: 740,
};

export type DiningProps = {
  p: Palette;
  frame: number;
  /** Global frame, so the clock keeps ticking across scene cuts. */
  clockFrame: number;
  /** Festive dressing: toran, fairy lights, fireworks in the window. */
  festive: number;
  /** Scale (0..1) of each feast dish as it pops onto the table; omit for the lonely meal. */
  feast?: number[];
  /** Characters seated behind the table. */
  children?: React.ReactNode;
  /** The same characters with layer="arms", drawn over the table top. */
  overTable?: React.ReactNode;
  id: string;
};

const TableTop: React.FC<{p: Palette}> = ({p}) => (
  <g className="table-top">
    <rect x={160} y={1400} width={30} height={240} rx={8} fill={p.woodDark} />
    <rect x={890} y={1400} width={30} height={240} rx={8} fill={p.woodDark} />
    {/* cloth over the table: top surface, then the front drape */}
    <path d="M 186 1203 L 894 1203 L 936 1257 L 144 1257 Z" fill={p.fabricLight} />
    <path d="M 200 1212 L 880 1212" stroke="#ffffff" strokeWidth={3} opacity={0.12} />
    <path
      d="M 144 1257 L 936 1257 L 944 1420 Q 900 1436 850 1422 Q 790 1438 730 1422 Q 670 1438 610 1422 Q 550 1438 490 1422 Q 430 1438 370 1422 Q 310 1438 250 1422 Q 190 1438 136 1420 Z"
      fill={p.fabric}
    />
    <path
      d="M 300 1262 Q 296 1340 306 1424 M 540 1262 Q 548 1340 540 1428 M 780 1262 Q 774 1340 784 1424"
      stroke={p.fabricDark}
      strokeWidth={6}
      fill="none"
      opacity={0.6}
    />
    <path d="M 140 1392 Q 540 1404 940 1392" stroke={p.accent2} strokeWidth={8} fill="none" opacity={0.8} />
  </g>
);

export const DiningRoom: React.FC<DiningProps> = ({p, frame, clockFrame, festive, feast, children, overTable, id}) => {
  const s = (i: number) => (feast ? Math.max(0, feast[i] ?? 0) : 0);
  const scaled = (i: number, x: number, y: number, node: React.ReactNode) =>
    s(i) > 0.001 ? (
      <g key={i} transform={`translate(${x} ${y}) scale(${s(i)}) translate(${-x} ${-y})`}>
        {node}
      </g>
    ) : null;

  return (
    <g className="dining-room">
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.wallTop} />
          <stop offset="100%" stopColor={p.wallBottom} />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.floorFar} />
          <stop offset="100%" stopColor={p.floor} />
        </linearGradient>
      </defs>

      {/* wall */}
      <rect x={-300} y={-400} width={1680} height={1660} fill={`url(#${id}-wall)`} />
      <rect x={-300} y={1060} width={1680} height={190} fill={p.wallBottom} opacity={0.55} />
      <rect x={-300} y={1052} width={1680} height={14} fill={p.wallTrim} />

      <Window x={70} y={560} w={250} h={330} p={p} id={`${id}-win`}>
        <Moon x={250} y={650} r={30} color={p.light} sky={p.sky} />
        {festive > 0 && (
          <g opacity={festive}>
            <Fireworks frame={frame} x={70} y={560} w={250} h={330} />
          </g>
        )}
      </Window>
      {festive > 0 && (
        <g opacity={festive}>
          <Toran x1={30} x2={360} y={530} sag={22} scale={0.9} />
        </g>
      )}

      <MemorialPhoto x={760} y={690} p={p} />
      <WallClock x={960} y={640} r={52} p={p} frame={clockFrame} />

      {/* floor with simple perspective boards */}
      <rect x={-300} y={1250} width={1680} height={1000} fill={`url(#${id}-floor)`} />
      <rect x={-300} y={1236} width={1680} height={16} fill={p.wallTrim} />
      {[1290, 1350, 1440, 1570, 1750, 1990].map((yy) => (
        <line key={yy} x1={-300} y1={yy} x2={1380} y2={yy} stroke={p.floorLine} strokeWidth={3} opacity={0.5} />
      ))}
      {Array.from({length: 13}).map((_, i) => {
        const x0 = -180 + i * 120;
        return <line key={i} x1={x0} y1={1252} x2={540 + (x0 - 540) * 3} y2={2250} stroke={p.floorLine} strokeWidth={3} opacity={0.4} />;
      })}
      <ellipse cx={540} cy={1600} rx={460} ry={46} fill={p.shadow} opacity={0.35} />

      {/* back table legs and chairs sit behind the characters */}
      <rect x={212} y={1400} width={24} height={130} rx={6} fill={p.woodDark} opacity={0.9} />
      <rect x={844} y={1400} width={24} height={130} rx={6} fill={p.woodDark} opacity={0.9} />
      <Chair x={DINING.momX} floorY={1520} p={p} w={190} />
      <Chair x={DINING.chairX} floorY={1520} p={p} />

      {children}

      <TableTop p={p} />

      {festive > 0 && (
        <g opacity={festive}>
          <path d="M 470 1203 L 610 1203 L 640 1257 L 440 1257 Z" fill={p.accent} />
          <path d="M 440 1257 L 640 1257 L 640 1340 L 600 1325 L 560 1345 L 520 1325 L 480 1345 L 440 1325 Z" fill={p.accent} />
          <path d="M 446 1300 L 634 1300" stroke={p.fabricDark} strokeWidth={4} strokeDasharray="10 8" />
        </g>
      )}

      {/* lonely meal: one plate of plain rice and a glass of water */}
      {!feast && (
        <g>
          <SteelPlate x={DINING.momX} y={1232} rx={96} p={p}>
            <RiceMound x={DINING.momX + 6} y={1230} w={46} p={p} />
          </SteelPlate>
          <Tumbler x={470} y={1228} p={p} />
        </g>
      )}

      {/* the Diwali feast, each dish springs in */}
      {feast && (
        <g>
          {scaled(
            0,
            DINING.momX,
            1234,
            <SteelPlate x={DINING.momX} y={1234} rx={96} p={p}>
              <RiceMound x={DINING.momX - 20} y={1232} w={34} p={p} />
              <PuriStack x={DINING.momX + 36} y={1236} w={30} />
            </SteelPlate>,
          )}
          {scaled(
            1,
            DINING.sonX,
            1234,
            <SteelPlate x={DINING.sonX} y={1234} rx={96} p={p}>
              <RiceMound x={DINING.sonX + 22} y={1232} w={34} p={p} />
              <PuriStack x={DINING.sonX - 34} y={1236} w={30} />
            </SteelPlate>,
          )}
          {scaled(2, 470, 1214, <Bowl x={470} y={1214} w={40} fill="#e9b23a" p={p} />)}
          {scaled(3, 610, 1214, <Bowl x={610} y={1214} w={40} fill="#7e9b36" p={p} />)}
          {scaled(
            4,
            540,
            1246,
            <SteelPlate x={540} y={1246} rx={70} p={p}>
              <Laddoo x={512} y={1232} r={15} />
              <Laddoo x={540} y={1226} r={15} />
              <Jalebi x={570} y={1238} r={16} />
            </SteelPlate>,
          )}
          {scaled(5, 205, 1250, <Diya x={205} y={1250} scale={0.55} frame={frame} seed={3} id={`${id}-d1`} />)}
          {scaled(6, 878, 1250, <Diya x={878} y={1250} scale={0.55} frame={frame} seed={7} id={`${id}-d2`} />)}
          {scaled(7, 540, 1230, <Petals x={240} y={1214} w={600} h={34} seed={4} n={18} />)}
        </g>
      )}

      {/* arms drawn again on top of the table so hands rest on the cloth and reach the plates */}
      {overTable}

      {festive > 0 && (
        <g opacity={festive}>
          <FairyLights x1={-20} x2={1100} y={120} sag={80} frame={frame} count={18} />
        </g>
      )}
      <Bulb x={470} y={640} p={p} frame={frame} intensity={1 - festive * 0.3} />
    </g>
  );
};
