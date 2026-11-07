// Scene 3b - Memory (10-15 s): lying awake, Mom remembers a Diwali night years ago.
// Her husband kneels to light a flowerpot, their little boy jumps with a sparkler,
// and she claps and laughs. Shown with a soft golden, dreamy "memory" look.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Dad} from '../characters/Dad';
import {Kid} from '../characters/Kid';
import {Mom} from '../characters/Mom';
import {worldToChar} from '../characters/coords';
import {Stage} from '../components/Camera';
import {Flowerpot, IncenseStick, Sparkler} from '../components/Crackers';
import {useMood, useSceneFrame} from '../lib/context';
import {flicker, keys, lerp, mixPt} from '../lib/anim';
import {Courtyard} from '../sets/Courtyard';
import {WARM} from '../theme';
import type {Pt} from '../rig/Arm';

const IGNITE = 26;
const POT = {x: 455, y: 1800};
const DAD = {x: 330, y: 1790, scale: 1.1, drop: 230};
const KID = {x: 600, y: 1812, scale: 1.3};
const MOM = {x: 835, y: 1795, scale: 1.12};

/** Kid's hop height (world px) at memory-local frame l. */
const kidHop = (l: number) =>
  l < IGNITE
    ? Math.abs(Math.sin(l * 0.25)) * 6
    : Math.abs(Math.sin((l - IGNITE) * 0.21)) * 40 * (0.6 + 0.4 * Math.cos((l - IGNITE) * 0.05));

/** Sparkler hand (kid-local) and the sparkler's world-space base and tip. */
const sparklerAt = (l: number) => {
  const a = l * 0.33;
  const hand: Pt = {x: 64 + Math.cos(a) * 26, y: -300 + Math.sin(a) * 26};
  const y = KID.y - kidHop(l);
  const base = {x: KID.x + hand.x * KID.scale, y: y + hand.y * KID.scale};
  const dir = {x: Math.cos((-70 * Math.PI) / 180), y: Math.sin((-70 * Math.PI) / 180)};
  const tip = {x: base.x + dir.x * 92, y: base.y + dir.y * 92};
  return {hand, base, tip};
};

export const SceneMemory: React.FC = () => {
  const l = useSceneFrame();
  const {globalFrame: frame} = useMood();
  const p = WARM;
  const lit = l >= IGNITE;
  const after = keys(l, [IGNITE, IGNITE + 10], [0, 1]);
  const laugh = Math.sin(l * 0.9) * after;

  // Dad: incense stick to the flowerpot, then pulls back laughing
  const dadHandWorld = mixPt({x: 412, y: 1702}, {x: 470, y: 1452}, keys(l, [IGNITE - 2, IGNITE + 12], [0, 1]));
  const dadTip = lit ? {x: dadHandWorld.x + 36, y: dadHandWorld.y - 92} : {x: POT.x - 2, y: POT.y - 50};
  const dadHand = worldToChar(dadHandWorld, DAD);
  const dadKnee = worldToChar({x: 250, y: 1736}, DAD);

  // Kid: sparkler circles + hop
  const sp = sparklerAt(l);
  const trail = Array.from({length: 9}).map((_, i) => sparklerAt(l - (i + 1)).tip);

  // Mom: clapping once the fountain goes up
  const clap = lit ? Math.abs(Math.sin((l - IGNITE) * 0.45)) : 0;

  const c = keys(l, [-18, 150], [0, 1]);
  const camera = {zoom: lerp(1.0, 1.1, c), x: lerp(545, 560, c), y: lerp(1180, 1260, c)};

  // dreamy entry/exit
  const blur = keys(l, [-18, 4, 132, 150], [7, 0, 0, 6]);
  const scale = keys(l, [-18, 150], [1.05, 1]);
  const leak = (l + 40) / 190;

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{filter: `sepia(0.22) saturate(1.12) brightness(1.04) blur(${blur.toFixed(2)}px)`, transform: `scale(${scale})`}}
      >
        <Stage camera={camera}>
          <Courtyard
            p={p}
            frame={frame}
            id="mem"
            front={
              <>
                <Flowerpot x={POT.x} y={POT.y} frame={l} ignite={IGNITE} scale={1.2} id="mem-pot" />
                <IncenseStick hand={dadHandWorld} tip={dadTip} frame={frame} />
                <Sparkler hand={sp.base} tip={sp.tip} trail={trail} frame={frame} id="mem-sp" seed={4} />
              </>
            }
          >
            <Dad
              frame={frame}
              {...DAD}
              pose="kneel"
              headTurn={lerp(0.25, 0.4, after)}
              headTilt={lerp(4, -6, after)}
              headBob={laugh * 3}
              armR={{to: dadHand, bend: -1}}
              armL={{to: dadKnee}}
              face={{
                look: {x: lerp(0.6, 0.5, after), y: lerp(0.9, -0.2, after)},
                brow: lerp(0.4, 0.3, after),
                smile: lerp(0.35, 1, after),
                open: after * (0.45 + laugh * 0.15),
                eyeOpen: lerp(1, 0.25, after),
                squint: after * 0.8,
              }}
            />
            <Kid
              frame={frame}
              x={KID.x}
              y={KID.y - kidHop(l)}
              scale={KID.scale}
              headTilt={after * Math.sin(l * 0.21) * 6}
              headTurn={lerp(-0.35, 0.2, after)}
              armR={{to: sp.hand, handAngle: -70}}
              armL={{to: lit ? {x: -68, y: -336 + Math.sin(l * 0.6) * 10} : {x: -62, y: -196}}}
              face={{
                look: {x: lerp(-0.7, 0.5, after), y: lerp(0.8, -0.4, after)},
                brow: lerp(0.8, 0.5, after),
                smile: lerp(0.5, 1, after),
                open: lerp(0.3, 0.75 + laugh * 0.15, after),
                sparkle: 1,
                squint: after * 0.35,
              }}
            />
            <Mom
              frame={frame}
              {...MOM}
              young
              seed={12}
              headTurn={-0.45}
              headTilt={-6 + laugh * 2}
              armL={{to: {x: -8 - clap * 18, y: -442}, elbow: {x: -84, y: -350}}}
              armR={{to: {x: 8 + clap * 18, y: -442}, elbow: {x: 84, y: -350}}}
              face={{
                look: {x: -1, y: 0.2},
                smile: lerp(0.7, 1, after),
                open: after * (0.4 + laugh * 0.15),
                squint: 0.3 + after * 0.4,
                sparkle: 0.8,
              }}
            />
          </Courtyard>
        </Stage>
      </AbsoluteFill>
      {/* memory haze: glowing edges and a drifting light leak */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 68% 55% at 50% 52%, rgba(255,236,200,0) 50%, rgba(255,222,160,0.6) 100%)',
          mixBlendMode: 'screen',
          opacity: 0.85 + flicker(l, 2) * 0.05,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${lerp(15, 85, leak)}% ${lerp(20, 35, leak)}%, rgba(255,170,90,0.4) 0%, rgba(255,170,90,0) 38%)`,
          mixBlendMode: 'screen',
        }}
      />
    </AbsoluteFill>
  );
};
