// Scene 5 (15-21 s): cooking montage, four quick shots that dissolve into each other:
// (a) stirring the pot, (b) laughing together, (c) plating sweets, (d) the table filling up.
import React from 'react';
import {Mom} from '../characters/Mom';
import {Son} from '../characters/Son';
import {worldToChar} from '../characters/coords';
import {Stage} from '../components/Camera';
import {Shot, useMood, useSceneFrame} from '../lib/context';
import {keys, lerp, pop, wave} from '../lib/anim';
import {Kadai, Kitchen} from '../sets/Kitchen';
import {DiningRoom} from '../sets/DiningRoom';
import {Barfi, Jalebi, Laddoo, Petals, SteelPlate} from '../sets/Props';
import {CHARACTERS, Palette} from '../theme';

const ShotStir: React.FC<{l: number; frame: number; p: Palette}> = ({l, frame, p}) => {
  const MOM = {x: 470, y: 1720, scale: 1.45};
  const th = frame * 0.26;
  const stir = worldToChar({x: 470 + Math.cos(th) * 60, y: 1205 + Math.sin(th) * 10}, MOM);
  const potHandle = worldToChar({x: 622, y: 1262}, MOM);
  const c = keys(l, [-8, 50], [0, 1]);
  return (
    <Stage camera={{zoom: lerp(1.24, 1.34, c), x: 480, y: lerp(1160, 1140, c)}}>
      <Kitchen p={p} frame={frame} id="s5a" front={<Kadai x={470} y={1290} frame={frame} p={p} />}>
        <Mom
          frame={frame}
          {...MOM}
          seed={6}
          headTilt={wave(frame, 40) * 4}
          armL={{to: stir, handAngle: 96, prop: 'ladle'}}
          armR={{to: potHandle}}
          face={{smile: 0.6, look: {x: 0, y: 0.85}, open: Math.max(0, wave(frame, 16)) * 0.12, sparkle: 0.4}}
        />
      </Kitchen>
    </Stage>
  );
};

const ShotLaugh: React.FC<{l: number; frame: number; p: Palette}> = ({l, frame, p}) => {
  const laugh = keys(l, [6, 14], [0, 1]);
  const talk = l < 8 ? Math.max(0, Math.sin(l * 1.3)) * 0.3 : 0;
  const bounce = Math.sin(l * 1.15) * laugh;
  const c = keys(l, [-8, 50], [0, 1]);
  return (
    <Stage camera={{zoom: lerp(1.14, 1.2, c), x: 545, y: 1110}}>
      <Kitchen
        p={p}
        frame={frame}
        id="s5b"
        front={
          <SteelPlate x={545} y={1300} rx={90} p={p}>
            <Laddoo x={515} y={1282} r={18} />
            <Laddoo x={552} y={1276} r={18} />
            <Laddoo x={580} y={1288} r={18} />
          </SteelPlate>
        }
      >
        <Son
          frame={frame}
          x={320}
          y={1690}
          scale={1.35}
          seed={8}
          backpack={false}
          headTurn={0.4}
          headTilt={laugh * 7}
          headBob={bounce * 4}
          lean={laugh * 3}
          armL={{to: {x: -112, y: -585}, elbow: {x: -138, y: -440}, prop: 'laddoo', handAngle: -95}}
          armR={{to: {x: 36, y: -372}, elbow: {x: 104, y: -420}}}
          face={{smile: 0.6 + laugh * 0.4, open: talk + laugh * (0.55 + bounce * 0.2), eyeOpen: 1 - laugh, squint: laugh}}
        />
        <Mom
          frame={frame}
          x={770}
          y={1720}
          scale={1.45}
          seed={6}
          headTurn={-0.45}
          headTilt={-laugh * 7}
          headBob={-bounce * 3}
          lean={-laugh * 3}
          armL={{to: {x: -6, y: lerp(-300, -446, laugh)}, elbow: {x: -84, y: lerp(-300, -352, laugh)}}}
          face={{smile: 0.7 + laugh * 0.3, open: laugh * (0.5 - bounce * 0.15), eyeOpen: 1 - laugh, squint: laugh}}
        />
      </Kitchen>
    </Stage>
  );
};

const ShotPlating: React.FC<{l: number; frame: number; p: Palette}> = ({l, frame, p}) => {
  const items: {at: number; node: (s: number) => React.ReactNode}[] = [
    {at: 0, node: () => <Laddoo x={420} y={960} r={52} />},
    {at: 4, node: () => <Laddoo x={350} y={1080} r={52} />},
    {at: 8, node: () => <Jalebi x={660} y={930} r={64} />},
    {at: 12, node: () => <Jalebi x={720} y={1070} r={60} />},
    {at: 16, node: () => <Barfi x={470} y={1200} r={34} rot={8} />},
    {at: 19, node: () => <Barfi x={570} y={1235} r={34} rot={-6} />},
    {at: 22, node: () => <Barfi x={670} y={1200} r={34} rot={14} />},
    {at: 34, node: () => <Laddoo x={545} y={1065} r={56} />},
  ];
  const hand = keys(l, [18, 32, 42], [0, 1, 0]);
  const hx = lerp(980, 600, hand);
  const hy = lerp(560, 990, hand);
  const C = CHARACTERS.mom;
  return (
    <Stage camera={{zoom: lerp(1.0, 1.07, keys(l, [-8, 50], [0, 1])), x: 540, y: 1060, rotate: lerp(-2, 1, keys(l, [-8, 50], [0, 1]))}}>
      <rect x={-300} y={-400} width={1680} height={2800} fill={p.fabric} />
      {Array.from({length: 12}).map((_, i) => (
        <circle
          key={i}
          cx={(i % 4) * 340 + 30}
          cy={Math.floor(i / 4) * 900 + 200}
          r={120}
          fill="none"
          stroke={p.accent}
          strokeWidth={6}
          opacity={0.35}
          strokeDasharray="12 14"
        />
      ))}
      <circle cx={552} cy={1078} r={344} fill={p.shadow} opacity={0.35} />
      <circle cx={540} cy={1065} r={340} fill={p.steelDark} />
      <circle cx={540} cy={1065} r={312} fill={p.steel} />
      <path d="M 300 880 A 300 300 0 0 1 560 765" stroke="#ffffff" strokeWidth={10} fill="none" opacity={0.35} strokeLinecap="round" />
      <Petals x={190} y={720} w={700} h={700} seed={2} n={20} />
      {items.map((it, i) => {
        const s = pop(l, it.at, 9, 160);
        if (s <= 0.001) return null;
        return (
          <g key={i} transform={`translate(0 ${(1 - Math.min(1, s)) * -60})`} opacity={Math.min(1, s * 2)}>
            {it.node(s)}
          </g>
        );
      })}
      {/* Mom's hand reaching in to place the last laddoo */}
      {hand > 0.01 && (
        <g>
          <path d={`M ${hx + 40} ${hy - 20} L 1300 ${hy - 700} L 1300 ${hy - 560} L ${hx + 70} ${hy + 20} Z`} fill={C.skin} />
          <path d={`M 1160 ${hy - 620} L 1300 ${hy - 700} L 1300 ${hy - 420} L 1110 ${hy - 380} Z`} fill={C.saree} />
          <path d={`M 1120 ${hy - 384} L 1140 ${hy - 600}`} stroke={C.sareeBorder} strokeWidth={12} />
          <ellipse cx={hx + 40} cy={hy} rx={48} ry={40} fill={C.skin} />
          <ellipse cx={hx + 6} cy={hy + 22} rx={18} ry={12} fill={C.skin} />
        </g>
      )}
    </Stage>
  );
};

const ShotTable: React.FC<{l: number; frame: number; p: Palette; clock: number}> = ({l, frame, p, clock}) => {
  const feast = Array.from({length: 8}).map((_, i) => pop(l, 2 + i * 4, 10, 170));
  const c = keys(l, [-8, 53], [0, 1]);
  return (
    <Stage camera={{zoom: lerp(1.38, 1.18, c), x: 540, y: lerp(1160, 1060, c)}}>
      <DiningRoom p={p} frame={frame} clockFrame={clock} festive={1} feast={feast} id="s5d" />
    </Stage>
  );
};

export const Scene5: React.FC = () => {
  const f = useSceneFrame();
  const {palette: p, globalFrame} = useMood();
  const frame = globalFrame;
  return (
    <>
      <Shot f={f} start={0} end={45} fadeIn={0}>
        {(l) => <ShotStir l={l} frame={frame} p={p} />}
      </Shot>
      <Shot f={f} start={45} end={90}>
        {(l) => <ShotLaugh l={l} frame={frame} p={p} />}
      </Shot>
      <Shot f={f} start={90} end={135}>
        {(l) => <ShotPlating l={l} frame={frame} p={p} />}
      </Shot>
      <Shot f={f} start={135} end={180} tail={12}>
        {(l) => <ShotTable l={l} frame={frame} p={p} clock={globalFrame} />}
      </Shot>
    </>
  );
};
