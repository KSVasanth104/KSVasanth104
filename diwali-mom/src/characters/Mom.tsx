import React from 'react';
import {CHARACTERS} from '../theme';
import {blink as autoBlink, breath} from '../lib/anim';
import {Arm, ArmLook} from '../rig/Arm';
import {Brow, Eye, Mouth, RollingTear} from '../rig/Face';
import type {CharacterProps} from './types';

const armLook = (C: typeof CHARACTERS.mom): ArmLook => ({
  l1: 100,
  l2: 92,
  w1: 27,
  w2: 21,
  w3: 17,
  handR: 14,
  skin: C.skin,
  skinShade: C.skinShade,
  sleeve: C.blouse,
  sleeveShade: C.sareeShade,
  sleeveLen: 0.42,
});
const ARM_NOW = armLook(CHARACTERS.mom);
const ARM_YOUNG = armLook(CHARACTERS.momYoung);

export const MOM_SHOULDER_L = {x: -62, y: -405};
export const MOM_SHOULDER_R = {x: 62, y: -405};
export const MOM_REST_L = {x: -70, y: -216};
export const MOM_REST_R = {x: 70, y: -216};
/** Useful anchor points (standing coordinates). */
export const MOM_MOUTH = {x: 0, y: -463};
export const MOM_HEAD = {x: 0, y: -505};

const SEAT_DROP = {stand: 0, lie: 0, sit: 110, kneel: 190} as const;

/**
 * Mom: ~55-year-old widow in a white/grey saree, grey hair in a bun, small bindi.
 * `young` draws her as she was ~25 years ago (flashback): black hair with jasmine,
 * green silk saree, red blouse, red bindi, no age lines.
 * Rig groups: lower-body, upper-body (torso), head (eyes, brows, mouth), arm-left,
 * arm-right (upper-arm → forearm → hand).
 */
export const Mom: React.FC<CharacterProps & {young?: boolean}> = (p) => {
  const young = p.young ?? false;
  const C = young ? CHARACTERS.momYoung : CHARACTERS.mom;
  const ARM = young ? ARM_YOUNG : ARM_NOW;
  const armsOnly = p.layer === 'arms';
  const {frame: f, seed = 1, scale = 1, pose = 'stand', face = {}} = p;
  const b = breath(f, seed) * (p.breathe ?? 1);
  const walking = p.walk !== undefined;
  const phase = (p.walk ?? 0) * Math.PI * 2;
  const step = walking ? Math.sin(phase) : 0;
  const bob = walking ? -Math.abs(Math.sin(phase)) * 6 : 0;
  const drop = (p.seatDrop ?? SEAT_DROP[pose]) + bob;

  const turn = p.headTurn ?? 0;
  const fx = turn * 12;
  const open = (face.eyeOpen ?? 1) * (face.noBlink ? 1 : autoBlink(f, seed));
  const look = face.look ?? {x: 0, y: 0};
  const swing = walking ? step * 14 : 0;

  const armL = p.armL ?? {to: {x: MOM_REST_L.x, y: MOM_REST_L.y + swing}};
  const armR = p.armR ?? {to: {x: MOM_REST_R.x, y: MOM_REST_R.y - swing}};
  const shoulderLift = -b * 1.6;

  const eyeArgs = {
    rx: 6.4,
    ry: 8.4,
    open,
    look,
    squint: face.squint ?? 0,
    sparkle: face.sparkle ?? 0,
    tears: face.tears ?? 0,
    closedStyle: face.closedStyle ?? 'happy',
    color: C.eye,
    lineColor: C.skinShade,
  } as const;

  return (
    <g className="mom" opacity={p.opacity ?? 1} transform={`translate(${p.x} ${p.y}) scale(${(p.flip ? -1 : 1) * scale} ${scale})`}>
      {/* ---------- lower body ---------- */}
      <g className="lower-body" display={armsOnly ? 'none' : undefined}>
        {pose === 'stand' && (
          <g transform={`skewX(${step * 2.5})`}>
            {[-1, 1].map((s) => {
              const lift = walking ? Math.max(0, Math.sin(phase + (s > 0 ? Math.PI : 0))) * 10 : 0;
              return <ellipse key={s} cx={s * 25} cy={-6 - lift} rx={17} ry={8} fill={C.skin} />;
            })}
            <path
              d="M -60 -290 C -66 -250 -72 -200 -76 -150 L -86 -14 Q 0 -2 86 -14 L 76 -150 C 72 -200 66 -250 60 -290 Z"
              fill={C.saree}
            />
            <path
              d="M -6 -270 L -14 -12 M 8 -270 L 12 -10 M 22 -262 L 34 -12 M -22 -262 L -36 -12"
              stroke={C.sareeShade}
              strokeWidth={3}
              strokeLinecap="round"
            />
            <path d="M -84 -36 Q 0 -24 84 -36 L 86 -14 Q 0 -2 -86 -14 Z" fill={C.sareeBorder} />
          </g>
        )}
        {pose === 'sit' && (
          <g>
            <ellipse cx={-28} cy={-6} rx={18} ry={8} fill={C.skin} />
            <ellipse cx={28} cy={-6} rx={18} ry={8} fill={C.skin} />
            <path d="M -62 -200 C -74 -170 -84 -140 -82 -90 L -76 -14 Q 0 -2 76 -14 L 82 -90 C 84 -140 74 -170 62 -200 Z" fill={C.saree} />
            <path
              d="M -80 -96 Q -42 -108 -6 -96 M 6 -96 Q 42 -108 80 -96"
              stroke={C.sareeShade}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
            />
            <path d="M 0 -96 L 0 -14" stroke={C.sareeShade} strokeWidth={3} />
            <path d="M -77 -34 Q 0 -22 77 -34 L 76 -14 Q 0 -2 -76 -14 Z" fill={C.sareeBorder} />
          </g>
        )}
        {pose === 'kneel' && (
          <g>
            <path d="M -64 -120 C -100 -96 -128 -60 -132 -14 Q 0 6 132 -14 C 128 -60 100 -96 64 -120 Z" fill={C.saree} />
            <path d="M -126 -30 Q 0 -14 126 -30" stroke={C.sareeBorder} strokeWidth={10} fill="none" />
          </g>
        )}
      </g>

      {/* ---------- upper body (pivots at the waist) ---------- */}
      <g className="upper-body" transform={`translate(0 ${drop}) rotate(${p.lean ?? 0} 0 -300)`}>
        {/* back hair & bun sit behind everything else in the upper body */}
        <g
          className="back-hair"
          display={armsOnly ? 'none' : undefined}
          transform={`translate(0 ${(p.headBob ?? 0) - b * 1.8}) rotate(${p.headTilt ?? 0} 0 -440) translate(0 -440) scale(1.1) translate(0 440)`}
        >
          <circle cx={44 - fx * 0.3} cy={-556} r={25} fill={C.hair} />
          <path
            d={`M ${30 - fx * 0.3} -540 Q ${44 - fx * 0.3} -548 ${60 - fx * 0.3} -540`}
            stroke={C.hairLight}
            strokeWidth={3}
            fill="none"
            opacity={0.7}
          />
          {young &&
            Array.from({length: 9}).map((_, i) => {
              const a = (-200 + i * 22) * (Math.PI / 180);
              return <circle key={i} cx={44 - fx * 0.3 + Math.cos(a) * 29} cy={-556 + Math.sin(a) * 29} r={5} fill="#fbf8ef" />;
            })}
          <ellipse cx={0} cy={-512} rx={59} ry={62} fill={C.hair} />
        </g>

        {/* torso, breathing about the waist */}
        <g
          className="torso"
          display={armsOnly ? 'none' : undefined}
          transform={`translate(0 -300) scale(${1 + b * 0.006} ${1 + b * 0.014}) translate(0 300)`}
        >
          <path d="M -15 -470 L -17 -404 L 17 -404 L 15 -470 Z" fill={C.skin} />
          <ellipse cx={0} cy={-448} rx={18} ry={9} fill={C.skinShade} />
          <path
            d="M -22 -424 C -50 -424 -68 -414 -72 -392 L -64 -318 C -30 -310 30 -310 64 -318 L 72 -392 C 68 -414 50 -424 22 -424 Q 0 -400 -22 -424 Z"
            fill={C.blouse}
          />
          {/* saree wrap at the waist */}
          <path d="M -64 -326 C -30 -316 30 -316 64 -326 L 62 -250 C 30 -242 -30 -242 -62 -250 Z" fill={C.saree} />
          {/* pallu draped over the left shoulder */}
          <path
            d="M 14 -424 C 40 -428 68 -420 74 -396 L 72 -300 C 30 -262 -20 -246 -66 -244 L -64 -300 C -24 -326 2 -370 14 -424 Z"
            fill={C.saree}
          />
          <path
            d="M 30 -400 C 20 -350 -10 -310 -50 -284 M 52 -380 C 44 -330 20 -300 -20 -272"
            stroke={C.sareeShade}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
          <path d="M 14 -424 C 2 -370 -24 -326 -64 -300" stroke={C.sareeBorder} strokeWidth={8} fill="none" strokeLinecap="round" />
        </g>

        {/* head */}
        <g
          className="head"
          display={armsOnly ? 'none' : undefined}
          transform={`translate(0 ${(p.headBob ?? 0) - b * 1.8}) rotate(${p.headTilt ?? 0} 0 -440) translate(0 -440) scale(1.1) translate(0 440)`}
        >
          <ellipse cx={-54 + Math.max(0, turn) * 4} cy={-500} rx={8} ry={13} fill={C.skin} opacity={1 - Math.max(0, -turn) * 0.9} />
          <ellipse cx={54 + Math.min(0, turn) * 4} cy={-500} rx={8} ry={13} fill={C.skin} opacity={1 - Math.max(0, turn) * 0.9} />
          <circle cx={-55 + Math.max(0, turn) * 4} cy={-489} r={2.6} fill={C.earring} opacity={1 - Math.max(0, -turn)} />
          <circle cx={55 + Math.min(0, turn) * 4} cy={-489} r={2.6} fill={C.earring} opacity={1 - Math.max(0, turn)} />
          <path d="M -52 -512 C -52 -566 52 -566 52 -512 C 52 -472 30 -443 0 -441 C -30 -443 -52 -472 -52 -512 Z" fill={C.skin} />
          {/* front hair with centre parting */}
          <path
            d={`M -57 -496 C -62 -560 -30 -580 ${fx} -574 C 30 -580 62 -560 57 -496 C 50 -522 30 -540 ${fx + 2} -541 C -22 -540 -48 -524 -57 -496 Z`}
            fill={C.hair}
          />
          <path
            d={`M ${fx - 6} -568 C -24 -564 -40 -548 -50 -520 M ${fx + 8} -568 C 26 -564 42 -548 52 -520 M ${fx - 14} -574 C -34 -570 -48 -556 -55 -530`}
            stroke={C.hairLight}
            strokeWidth={2.6}
            fill="none"
            strokeLinecap="round"
            opacity={0.8}
          />
          <g className="face" transform={`translate(${fx} 0)`}>
            <ellipse cx={-30} cy={-480} rx={11} ry={6.5} fill={C.blush} opacity={0.28 + Math.max(0, face.smile ?? 0) * 0.25} />
            <ellipse cx={30} cy={-480} rx={11} ry={6.5} fill={C.blush} opacity={0.28 + Math.max(0, face.smile ?? 0) * 0.25} />
            <Eye x={-21} y={-504} {...eyeArgs} />
            <Eye x={21} y={-504} {...eyeArgs} />
            {/* soft age lines under the eyes */}
            <path
              display={young ? 'none' : undefined}
              d="M -29 -491 Q -21 -487 -13 -491 M 13 -491 Q 21 -487 29 -491"
              stroke={C.skinShade}
              strokeWidth={1.8}
              fill="none"
              opacity={0.55}
              strokeLinecap="round"
            />
            <Brow x={-21} y={-524} w={20} side={-1} raise={face.brow ?? 0} sad={face.sad ?? 0} color={C.hairLight} thick={3.6} />
            <Brow x={21} y={-524} w={20} side={1} raise={face.brow ?? 0} sad={face.sad ?? 0} color={C.hairLight} thick={3.6} />
            <circle cx={0} cy={-530} r={young ? 4.6 : 3.4} fill={C.bindi} />
            <path
              d={`M ${-2 + turn * 3} -497 Q ${2 + turn * 4} -482 ${6 + turn * 2} -479`}
              stroke={C.skinShade}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
            />
            <path
              display={young ? 'none' : undefined}
              d="M -17 -478 Q -20 -468 -15 -460 M 17 -478 Q 20 -468 15 -460"
              stroke={C.skinShade}
              strokeWidth={1.6}
              fill="none"
              opacity={0.45}
              strokeLinecap="round"
            />
            <Mouth x={0} y={-463} w={11} smile={face.smile ?? 0} open={face.open ?? 0} color={C.mouth} tongue={C.tongue} />
            <RollingTear from={{x: -29, y: -500}} to={{x: -44, y: -458}} t={face.tearDrop ?? 0} />
            <RollingTear from={{x: 29, y: -500}} to={{x: 42, y: -460}} t={face.tearDrop2 ?? 0} />
          </g>
        </g>

        {/* arms on top of the torso */}
        <g className="arm-left" transform={`translate(0 ${shoulderLift})`}>
          <Arm shoulder={MOM_SHOULDER_L} pose={armL} look={ARM} side={-1} />
        </g>
        <g className="arm-right" transform={`translate(0 ${shoulderLift})`}>
          <Arm shoulder={MOM_SHOULDER_R} pose={armR} look={ARM} side={1} />
        </g>
      </g>
    </g>
  );
};
