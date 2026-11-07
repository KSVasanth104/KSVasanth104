// Scene 4 (11-15 s): the doorbell rings, Mom opens the door, her face lights up:
// her son is standing there. The palette warms and the diyas ignite.
import React from 'react';
import {Mom, MOM_REST_L, MOM_REST_R, MOM_SHOULDER_L, MOM_SHOULDER_R} from '../characters/Mom';
import {solveArm} from '../rig/Arm';
import {Son, SON_REST_R, SON_SHOULDER_R} from '../characters/Son';
import {worldToChar} from '../characters/coords';
import {Stage} from '../components/Camera';
import {useMood, useSceneFrame} from '../lib/context';
import {EASE_OUT, keys, lerp, mixPt, wave} from '../lib/anim';
import {Doorway, doorHandleAt} from '../sets/Doorway';

const MOM = {x: 250, y: 1780, scale: 1.32};

export const Scene4: React.FC = () => {
  const f = useSceneFrame();
  const {palette: p, warmth, globalFrame} = useMood();
  const frame = globalFrame;

  const ring = keys(f, [0, 26], [0, 1]);
  const turn = keys(f, [4, 16], [0, 0.6]);
  const reach = keys(f, [12, 30], [0, 1]);
  const open = keys(f, [32, 62], [0, 1], EASE_OUT);
  const release = keys(f, [50, 68], [0, 1]);
  const joy = keys(f, [46, 72], [0, 1]);
  const gasp = keys(f, [44, 52, 66], [0, 0.55, 0.12]);

  const handle = worldToChar(doorHandleAt(Math.min(open, 0.35)), MOM);
  const reachHand = mixPt({x: MOM_REST_R.x, y: MOM_REST_R.y}, handle, reach);
  const claspR = {x: 8, y: -452};
  const claspL = {x: -8, y: -452};

  const camT = keys(f, [0, 120], [0, 1]);
  const camera = {zoom: lerp(1.0, 1.12, camT), x: lerp(540, 560, camT), y: lerp(1120, 1110, camT)};

  const wavePhase = keys(f, [60, 74], [0, 1]);
  const sonStep = keys(f, [86, 118], [0, 1]);

  return (
    <Stage camera={camera}>
      <Doorway
        p={p}
        frame={frame}
        warmth={warmth}
        open={open}
        ring={ring < 1 ? ring : 0}
        id="s4"
        outside={
          <Son
            frame={frame}
            x={645}
            y={lerp(1548, 1556, sonStep)}
            scale={lerp(1.0, 1.04, sonStep)}
            seed={3}
            headTilt={-4 + joy * 4}
            headTurn={-0.25}
            armR={{
              to: {x: lerp(SON_REST_R.x, 150, wavePhase) + wave(f, 14) * 22 * wavePhase, y: lerp(SON_REST_R.y, -700, wavePhase)},
              elbow: mixPt(solveArm(SON_SHOULDER_R, SON_REST_R, 116, 106, -1).elbow, {x: 165, y: -560}, wavePhase),
            }}
            face={{smile: 0.85, look: {x: -0.6, y: 0}, sparkle: 0.6, brow: 0.3}}
          />
        }
        inside={
          <Mom
            frame={frame}
            {...MOM}
            seed={5}
            headTurn={turn}
            headTilt={joy * 6}
            lean={joy * 2}
            armL={{
              to: mixPt({x: MOM_REST_L.x, y: MOM_REST_L.y}, claspL, release),
              elbow: mixPt(solveArm(MOM_SHOULDER_L, MOM_REST_L, 100, 92, 1).elbow, {x: -84, y: -350}, release),
            }}
            armR={{
              to: mixPt(reachHand, claspR, release),
              elbow: mixPt(solveArm(MOM_SHOULDER_R, reachHand, 100, 92, -1).elbow, {x: 84, y: -350}, release),
            }}
            face={{
              look: {x: 0.9, y: -0.1},
              brow: keys(f, [2, 10, 40, 60], [0, 0.7, 0.3, 0.6]),
              sad: (1 - joy) * 0.4,
              smile: lerp(-0.1, 1, joy),
              open: gasp,
              sparkle: joy,
              squint: joy * 0.35,
              tears: joy * 0.6,
            }}
          />
        }
      />
    </Stage>
  );
};
