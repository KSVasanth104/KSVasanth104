// Scene 7 (26-32 s): Mom makes up her own bed for her son, unrolls a mat on the floor
// for herself, and lies down on it, smiling.
import React from 'react';
import {Mom} from '../characters/Mom';
import {worldToChar} from '../characters/coords';
import type {CharacterProps} from '../characters/types';
import {Stage} from '../components/Camera';
import {Shot, useMood, useSceneFrame} from '../lib/context';
import {breath, keys, lerp, pop, wave} from '../lib/anim';
import {BED_FRONT, BedroomFront, FloorMat} from '../sets/BedroomFront';
import {Palette} from '../theme';
import {TopDownNight, TOPDOWN_CLOSE} from './Scene8';

const MakeBed: React.FC<{l: number; frame: number; p: Palette}> = ({l, frame, p}) => {
  const MOM = {x: 640, y: 1500, scale: 1.3};
  const sweep = keys(l, [0, 46], [0, 1]);
  const pillowReach = keys(l, [44, 56, 74, 84], [0, 1, 1, 0.3]);
  const s1 = Math.sin(sweep * Math.PI * 3);
  const handL = worldToChar({x: 540 + s1 * 80, y: BED_FRONT.backY + 22}, MOM);
  const handRsheet = worldToChar({x: 730 + s1 * 80, y: BED_FRONT.backY + 24}, MOM);
  const handRpillow = worldToChar(
    {x: BED_FRONT.pillow.x - 30, y: BED_FRONT.pillow.y - 18 + Math.max(0, wave(l, 10)) * 10 * pillowReach},
    MOM,
  );
  const squash = l > 50 && l < 80 ? Math.max(0, wave(l, 10)) * 0.8 : 0;
  const c = keys(l, [-8, 90], [0, 1]);
  // drawn twice: whole body behind the bed, then just the arms on top of it
  const mom: CharacterProps = {
    frame,
    ...MOM,
    seed: 7,
    headTilt: lerp(-4, 6, pillowReach),
    headTurn: pillowReach * 0.35,
    armL: {to: handL, flatHand: true},
    armR: {to: {x: lerp(handRsheet.x, handRpillow.x, pillowReach), y: lerp(handRsheet.y, handRpillow.y, pillowReach)}, flatHand: true},
    face: {smile: 0.7, look: {x: pillowReach * 0.8, y: 0.9}, sparkle: 0.3},
  };
  return (
    <Stage camera={{zoom: lerp(1.25, 1.33, c), x: lerp(640, 680, c), y: 1150}}>
      <BedroomFront
        p={p}
        frame={frame}
        rumple={1 - sweep}
        squash={squash}
        id="s7a"
        behindBed={<Mom {...mom} pose="lie" />}
        overBed={<Mom {...mom} layer="arms" />}
      />
    </Stage>
  );
};

const UnrollMat: React.FC<{l: number; frame: number; p: Palette}> = ({l, frame, p}) => {
  const MOM = {x: 300, y: 1610, scale: 1.3};
  const roll = keys(l, [4, 40], [0, 1]);
  const rollX = lerp(380, 860, roll);
  const bow = keys(l, [0, 8, 36, 46], [190, 245, 250, 200]);
  const hand = worldToChar({x: Math.min(rollX - 20, 520), y: 1660}, {...MOM, drop: bow});
  const c = keys(l, [-8, 50], [0, 1]);
  return (
    <Stage camera={{zoom: lerp(1.3, 1.22, c), x: lerp(470, 520, c), y: 1360}}>
      <BedroomFront
        p={p}
        frame={frame}
        rumple={0}
        squash={0}
        id="s7b"
        floor={
          <>
            <Mom
              frame={frame}
              {...MOM}
              pose="kneel"
              seatDrop={bow}
              seed={7}
              headTilt={6}
              armL={{to: {x: hand.x - 30, y: hand.y}, flatHand: true}}
              armR={{to: {x: hand.x + 20, y: hand.y + 4}, flatHand: true}}
              face={{smile: 0.6, look: {x: 0.6, y: 1}}}
            />
            <FloorMat x1={240} rollX={rollX} y={1625} p={p} rollR={lerp(46, 22, roll)} />
          </>
        }
      />
    </Stage>
  );
};

export const Scene7: React.FC = () => {
  const f = useSceneFrame();
  const {palette: p} = useMood();
  const frame = f + 780;
  const settle = pop(f, 125, 18, 90);
  return (
    <>
      <Shot f={f} start={0} end={80} fadeIn={0}>
        {(l) => <MakeBed l={l} frame={frame} p={p} />}
      </Shot>
      <Shot f={f} start={80} end={125} fadeIn={10}>
        {(l) => <UnrollMat l={l} frame={frame} p={p} />}
      </Shot>
      <Shot f={f} start={125} end={180} fadeIn={12} tail={0}>
        {() => (
          <TopDownNight
            frame={frame}
            p={p}
            camera={{...TOPDOWN_CLOSE, zoom: TOPDOWN_CLOSE.zoom + (1 - settle) * 0.12}}
            momLook={0}
            momEyes={0}
            breathe={breath(frame, 2)}
          />
        )}
      </Shot>
    </>
  );
};
