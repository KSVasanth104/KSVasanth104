import React from 'react';
import {CHARACTERS} from '../theme';
import {blink as autoBlink, breath} from '../lib/anim';
import {Arm, ArmLook} from '../rig/Arm';
import {Brow, Eye, Mouth} from '../rig/Face';
import type {CharacterProps} from './types';

const C = CHARACTERS.son;

const ARM: ArmLook = {
  l1: 116,
  l2: 106,
  w1: 30,
  w2: 24,
  w3: 20,
  handR: 15,
  skin: C.skin,
  skinShade: C.skinShade,
  sleeve: C.kurta,
  sleeveShade: C.kurtaShade,
  sleeveLen: 1,
  fullSleeve: true,
  cuff: C.kurtaTrim,
};

export const SON_SHOULDER_L = {x: -70, y: -500};
export const SON_SHOULDER_R = {x: 70, y: -500};
export const SON_REST_L = {x: -82, y: -284};
export const SON_REST_R = {x: 82, y: -284};
export const SON_MOUTH = {x: 0, y: -572};
export const SON_HEAD = {x: 0, y: -610};

const SEAT_DROP = {stand: 0, lie: 0, sit: 130, kneel: 220} as const;

/**
 * Son: ~22, casual kurta, backpack.
 * Rig groups: legs, backpack, upper-body (torso), head (eyes, brows, mouth),
 * arm-left, arm-right (upper-arm → forearm → hand).
 */
export const Son: React.FC<CharacterProps & {backpack?: boolean}> = (p) => {
  const armsOnly = p.layer === 'arms';
  const {frame: f, seed = 2, scale = 1, pose = 'stand', face = {}, backpack = true} = p;
  const b = breath(f, seed) * (p.breathe ?? 1);
  const walking = p.walk !== undefined;
  const phase = (p.walk ?? 0) * Math.PI * 2;
  const step = walking ? Math.sin(phase) : 0;
  const bob = walking ? -Math.abs(step) * 8 : 0;
  const drop = (p.seatDrop ?? SEAT_DROP[pose]) + bob;
  const turn = p.headTurn ?? 0;
  const fx = turn * 12;
  const open = (face.eyeOpen ?? 1) * (face.noBlink ? 1 : autoBlink(f, seed, 110));
  const look = face.look ?? {x: 0, y: 0};
  const swing = walking ? step * 18 : 0;
  const armL = p.armL ?? {to: {x: SON_REST_L.x, y: SON_REST_L.y - swing}};
  const armR = p.armR ?? {to: {x: SON_REST_R.x, y: SON_REST_R.y + swing}};
  const shoulderLift = -b * 1.8;

  const eyeArgs = {
    rx: 6.2,
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

  const leg = (s: number) => {
    const lift = walking ? Math.max(0, Math.sin(phase + (s > 0 ? Math.PI : 0))) * 16 : 0;
    const footY = -12 - lift;
    const hx = s * 24;
    return (
      <g key={s} className={s < 0 ? 'leg-left' : 'leg-right'}>
        <path d={`M ${hx - 22} -300 L ${hx - 17 + s * 2} ${footY} L ${hx + 15 + s * 2} ${footY} L ${hx + 20} -300 Z`} fill={C.pants} />
        <path d={`M ${hx + s * 4} -230 L ${hx + s * 6} ${footY - 10}`} stroke={C.pantsShade} strokeWidth={3} strokeLinecap="round" />
        <ellipse cx={hx + s * 4} cy={footY + 4} rx={22} ry={11} fill={C.shoes} />
      </g>
    );
  };

  return (
    <g className="son" opacity={p.opacity ?? 1} transform={`translate(${p.x} ${p.y}) scale(${(p.flip ? -1 : 1) * scale} ${scale})`}>
      {/* ---------- legs ---------- */}
      <g className="lower-body" display={armsOnly ? 'none' : undefined}>
        {pose === 'stand' && [-1, 1].map(leg)}
        {pose === 'sit' && (
          <g>
            <path d="M -60 -180 L -56 -14 L -12 -14 L -6 -180 Z M 6 -180 L 12 -14 L 56 -14 L 60 -180 Z" fill={C.pants} />
            <path d="M -66 -190 Q 0 -150 66 -190 L 64 -150 Q 0 -120 -64 -150 Z" fill={C.pantsShade} />
            <ellipse cx={-34} cy={-8} rx={24} ry={11} fill={C.shoes} />
            <ellipse cx={34} cy={-8} rx={24} ry={11} fill={C.shoes} />
          </g>
        )}
      </g>

      <g className="upper-body" transform={`translate(0 ${drop}) rotate(${p.lean ?? 0} 0 -330)`}>
        {backpack && (
          <g className="backpack" display={armsOnly ? 'none' : undefined}>
            <rect x={-96} y={-528} width={192} height={196} rx={34} fill={C.bag} />
          </g>
        )}
        {/* back hair */}
        <g
          className="back-hair"
          display={armsOnly ? 'none' : undefined}
          transform={`translate(0 ${(p.headBob ?? 0) - b * 2}) rotate(${p.headTilt ?? 0} 0 -548) translate(0 -548) scale(1.1) translate(0 548)`}
        >
          <ellipse cx={0} cy={-630} rx={55} ry={52} fill={C.hair} />
        </g>

        <g
          className="torso"
          display={armsOnly ? 'none' : undefined}
          transform={`translate(0 -330) scale(${1 + b * 0.006} ${1 + b * 0.013}) translate(0 330)`}
        >
          <path d="M -16 -574 L -18 -510 L 18 -510 L 16 -574 Z" fill={C.skin} />
          <ellipse cx={0} cy={-552} rx={19} ry={9} fill={C.skinShade} />
          <path
            d="M -24 -528 C -56 -528 -76 -518 -80 -496 L -76 -380 C -76 -330 -78 -290 -82 -244 Q 0 -230 82 -244 C 78 -290 76 -330 76 -380 L 80 -496 C 76 -518 56 -528 24 -528 Z"
            fill={C.kurta}
          />
          <path d="M -70 -300 C -72 -280 -74 -262 -76 -246" stroke={C.kurtaShade} strokeWidth={4} strokeLinecap="round" />
          <path d="M 70 -300 C 72 -280 74 -262 76 -246" stroke={C.kurtaShade} strokeWidth={4} strokeLinecap="round" />
          <path d="M -80 -254 Q 0 -240 80 -254" stroke={C.kurtaTrim} strokeWidth={4} fill="none" opacity={0.85} />
          <rect x={-7} y={-520} width={14} height={92} rx={4} fill={C.kurtaShade} />
          {[-504, -480, -456].map((yy) => (
            <circle key={yy} cx={0} cy={yy} r={3.4} fill={C.kurtaTrim} />
          ))}
          <path d="M -23 -532 Q 0 -520 23 -532 L 21 -518 Q 0 -506 -21 -518 Z" fill={C.kurtaTrim} />
          {backpack && (
            <g className="straps">
              <path d="M -42 -526 C -50 -490 -52 -440 -48 -390" stroke={C.bagShade} strokeWidth={15} fill="none" strokeLinecap="round" />
              <path d="M 42 -526 C 50 -490 52 -440 48 -390" stroke={C.bagShade} strokeWidth={15} fill="none" strokeLinecap="round" />
              <path d="M -50 -446 L 50 -446" stroke={C.bagLight} strokeWidth={5} />
            </g>
          )}
        </g>

        <g
          className="head"
          display={armsOnly ? 'none' : undefined}
          transform={`translate(0 ${(p.headBob ?? 0) - b * 2}) rotate(${p.headTilt ?? 0} 0 -548) translate(0 -548) scale(1.1) translate(0 548)`}
        >
          <ellipse cx={-52 + Math.max(0, turn) * 4} cy={-606} rx={8} ry={13} fill={C.skin} opacity={1 - Math.max(0, -turn) * 0.9} />
          <ellipse cx={52 + Math.min(0, turn) * 4} cy={-606} rx={8} ry={13} fill={C.skin} opacity={1 - Math.max(0, turn) * 0.9} />
          <path d="M -50 -618 C -50 -672 50 -672 50 -618 C 50 -578 32 -548 0 -546 C -32 -548 -50 -578 -50 -618 Z" fill={C.skin} />
          {/* stubble */}
          <path
            d="M -47 -596 C -40 -562 -20 -548 0 -547 C 20 -548 40 -562 47 -596 C 36 -572 18 -562 0 -563 C -18 -562 -36 -572 -47 -596 Z"
            fill={C.hair}
            opacity={0.16}
          />
          {/* hair with a front swoop */}
          <path
            d={`M -56 -606 C -66 -682 -8 -704 32 -690 C 62 -680 68 -646 56 -604 C 52 -628 40 -642 ${18 + fx} -644 C ${-2 + fx} -628 -30 -642 -46 -624 C -51 -616 -54 -610 -56 -606 Z`}
            fill={C.hair}
          />
          <path
            d={`M -30 -684 C ${-6 + fx} -690 ${20 + fx} -684 40 -668`}
            stroke={C.hairLight}
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
          <g className="face" transform={`translate(${fx} 0)`}>
            <ellipse cx={-30} cy={-584} rx={10} ry={6} fill={C.blush} opacity={0.12 + Math.max(0, face.smile ?? 0) * 0.25} />
            <ellipse cx={30} cy={-584} rx={10} ry={6} fill={C.blush} opacity={0.12 + Math.max(0, face.smile ?? 0) * 0.25} />
            <Eye x={-20} y={-608} {...eyeArgs} />
            <Eye x={20} y={-608} {...eyeArgs} />
            <Brow x={-20} y={-630} w={22} side={-1} raise={face.brow ?? 0} sad={face.sad ?? 0} color={C.hair} thick={5.4} />
            <Brow x={20} y={-630} w={22} side={1} raise={face.brow ?? 0} sad={face.sad ?? 0} color={C.hair} thick={5.4} />
            <path
              d={`M ${-1 + turn * 3} -600 Q ${3 + turn * 4} -586 ${7 + turn * 2} -584`}
              stroke={C.skinShade}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
            />
            <Mouth x={0} y={-568} w={12} smile={face.smile ?? 0} open={face.open ?? 0} color={C.mouth} tongue={C.tongue} />
          </g>
        </g>

        <g className="arm-left" transform={`translate(0 ${shoulderLift})`}>
          <Arm shoulder={SON_SHOULDER_L} pose={armL} look={ARM} side={-1} />
        </g>
        <g className="arm-right" transform={`translate(0 ${shoulderLift})`}>
          <Arm shoulder={SON_SHOULDER_R} pose={armR} look={ARM} side={1} />
        </g>
      </g>
    </g>
  );
};
