// Scene 4 (17-23 s): the doorbell rings again. Mom walks to the door, still wiping
// her tears, and opens it. The festival outside spills in. She freezes (disbelief),
// recognises her son (hand to mouth, tears), and only then the smile breaks through.
// The room warms with her face, not before it.
//
// Emotional beats (scene-local frames):
//   0-34    walks in from the left, wiping her eye
//   34-50   reaches for the handle
//   50-80   door swings open: warm light, fireworks, her son on the doorstep
//   80-100  freeze: eyes wide, mouth open, hands drop, no smile yet
//   92      son: "Amma…"
//   100-128 recognition: hand to mouth, brows tilt, tears roll, a trembling smile
//   128-180 smile breaks through the tears, hands clasped; he opens his arms and steps in
import React from 'react';
import {Mom, MOM_REST_L, MOM_REST_R, MOM_SHOULDER_L, MOM_SHOULDER_R} from '../characters/Mom';
import {Son, SON_REST_L, SON_REST_R, SON_SHOULDER_L, SON_SHOULDER_R} from '../characters/Son';
import {worldToChar} from '../characters/coords';
import {Stage} from '../components/Camera';
import {useMood, useSceneFrame} from '../lib/context';
import {EASE, EASE_OUT, keys, lerp, mixPt, wave} from '../lib/anim';
import {Pt, solveArm} from '../rig/Arm';
import {Doorway, doorHandleAt} from '../sets/Doorway';
import {WARM} from '../theme';

const MOM = {x: 250, y: 1780, scale: 1.32};

type Pose = {to: Pt; elbow: Pt};
/** Interpolate between keyed arm poses (eased per segment). */
const poseAt = (f: number, track: [number, Pose][]): Pose => {
  if (f <= track[0][0]) return track[0][1];
  for (let i = 0; i < track.length - 1; i++) {
    const [f0, a] = track[i];
    const [f1, b] = track[i + 1];
    if (f <= f1) {
      const t = EASE((f - f0) / (f1 - f0));
      return {to: mixPt(a.to, b.to, t), elbow: mixPt(a.elbow, b.elbow, t)};
    }
  }
  return track[track.length - 1][1];
};
const ik = (shoulder: Pt, to: Pt, bend: 1 | -1, l1 = 100, l2 = 92): Pose => ({to, elbow: solveArm(shoulder, to, l1, l2, bend).elbow});

const REST_L = ik(MOM_SHOULDER_L, MOM_REST_L, 1);
const REST_R = ik(MOM_SHOULDER_R, MOM_REST_R, -1);
const WIPE_L: Pose = {to: {x: -26, y: -500}, elbow: {x: -98, y: -392}};
const MOUTH_L: Pose = {to: {x: -6, y: -462}, elbow: {x: -86, y: -360}};
const CLASP_L: Pose = {to: {x: -8, y: -452}, elbow: {x: -84, y: -350}};
const HEART_R: Pose = {to: {x: 22, y: -396}, elbow: {x: 88, y: -330}};
const CLASP_R: Pose = {to: {x: 8, y: -452}, elbow: {x: 84, y: -350}};

export const Scene4: React.FC = () => {
  const f = useSceneFrame();
  const {palette: p, warmth, globalFrame: frame} = useMood();

  const ring = keys(f, [0, 26], [0, 1]);
  const open = keys(f, [50, 80], [0, 1], EASE_OUT);
  const freeze = keys(f, [76, 86], [0, 1]);
  const recog = keys(f, [100, 124], [0, 1]);
  const joy = keys(f, [124, 150], [0, 1]);

  // --- Mom walks in, wiping her eye ---
  const walking = f < 32;
  const momX = keys(f, [0, 32], [60, 250], EASE_OUT);
  const rub = f > 8 && f < 28 ? wave(f, 9) * 6 : 0;

  // --- arms ---
  const handle = ik(MOM_SHOULDER_R, worldToChar(doorHandleAt(Math.min(open, 0.35)), MOM), -1);
  const wipe = {to: {x: WIPE_L.to.x + rub, y: WIPE_L.to.y}, elbow: WIPE_L.elbow};
  const armL = poseAt(f, [
    [0, REST_L],
    [8, wipe],
    [27, wipe],
    [36, REST_L],
    [102, REST_L],
    [114, MOUTH_L],
    [130, MOUTH_L],
    [142, CLASP_L],
  ]);
  const armR = poseAt(f, [
    [0, REST_R],
    [34, REST_R],
    [46, handle],
    [70, handle],
    [84, REST_R],
    [104, REST_R],
    [116, HEART_R],
    [130, HEART_R],
    [142, CLASP_R],
  ]);

  // trembling smile while crying, settling once the joy wins
  const tremble = wave(f, 7) * 0.08 * recog * (1 - joy);
  const sobLaugh = Math.max(0, wave(f, 10)) * joy;

  // --- son ---
  const armsOpen = keys(f, [128, 150], [0, 1]);
  const sonStep = keys(f, [140, 176], [0, 1]);
  const sonArmL = mixPt(SON_REST_L, {x: -168, y: -560}, armsOpen);
  const sonArmR = mixPt(SON_REST_R, {x: 168, y: -560}, armsOpen);

  const camT = keys(f, [0, 60, 126, 180], [0, 0.25, 1, 0.8]);
  const camera = {zoom: lerp(1.0, 1.3, camT), x: lerp(520, 455, camT), y: lerp(1140, 1130, camT)};

  return (
    <Stage camera={camera}>
      <Doorway
        p={p}
        pOut={WARM}
        frame={frame}
        warmth={warmth}
        outsideWarmth={1}
        open={open}
        ring={ring < 1 ? ring : 0}
        id="s4"
        outside={
          <Son
            frame={frame}
            x={645}
            y={lerp(1548, 1572, sonStep)}
            scale={lerp(1.0, 1.06, sonStep)}
            walk={sonStep > 0 && sonStep < 1 ? sonStep * 2 : undefined}
            seed={3}
            headTilt={lerp(-2, 6, joy)}
            headTurn={-0.3}
            armL={{to: sonArmL, elbow: mixPt(solveArm(SON_SHOULDER_L, SON_REST_L, 116, 106, 1).elbow, {x: -150, y: -460}, armsOpen)}}
            armR={{to: sonArmR, elbow: mixPt(solveArm(SON_SHOULDER_R, SON_REST_R, 116, 106, -1).elbow, {x: 150, y: -460}, armsOpen)}}
            face={{
              look: {x: -0.7, y: 0},
              smile: lerp(0.5, 1, joy),
              open: keys(f, [90, 94, 104], [0, 0.35, 0]) + joy * 0.25,
              brow: lerp(0.45, 0.2, joy),
              sparkle: 0.7,
              squint: joy * 0.5,
              tears: recog * 0.5,
            }}
          />
        }
        inside={
          <Mom
            frame={frame}
            {...MOM}
            x={momX}
            walk={walking ? f / 16 : undefined}
            seed={5}
            headTurn={keys(f, [6, 30], [0.2, 0.6])}
            headTilt={lerp(0, 7, joy) - freeze * (1 - recog) * 2}
            headBob={sobLaugh * 2}
            lean={joy * 2 - freeze * (1 - recog) * 1.5}
            armL={armL}
            armR={armR}
            face={{
              look: {x: 0.9, y: -0.1},
              // sad → curious → frozen → crying-happy → smiling through tears
              sad: lerp(lerp(0.6, 0, freeze), 0.55, recog) * (1 - joy * 0.6),
              brow: keys(f, [0, 40, 80, 90, 124], [0.1, 0.35, 0.35, 1, 0.5]),
              smile: lerp(lerp(-0.25, 0, freeze), 0.45, recog) + joy * 0.55 + tremble,
              open: freeze * (1 - recog) * 0.3 + recog * (1 - joy) * 0.1 + sobLaugh * 0.3,
              eyeOpen: lerp(0.85, 1.08, freeze) - joy * 0.25,
              sparkle: freeze * 0.4 + joy * 0.6,
              squint: joy * 0.45,
              tears: 0.7,
              tearDrop: keys(f, [102, 150, 176], [0, 1, 1.2]),
              tearDrop2: keys(f, [122, 172], [0, 1]),
            }}
          />
        }
      />
    </Stage>
  );
};
