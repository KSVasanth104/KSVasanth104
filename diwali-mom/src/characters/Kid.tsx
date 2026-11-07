import React from 'react';
import {CHARACTERS} from '../theme';
import {blink as autoBlink, breath} from '../lib/anim';
import {Arm, ArmLook} from '../rig/Arm';
import {Brow, Eye, Mouth} from '../rig/Face';
import type {CharacterProps} from './types';

const C = CHARACTERS.kid;

const ARM: ArmLook = {
  l1: 56,
  l2: 52,
  w1: 19,
  w2: 16,
  w3: 14,
  handR: 11,
  skin: C.skin,
  skinShade: C.skinShade,
  sleeve: C.kurta,
  sleeveShade: C.kurtaShade,
  sleeveLen: 1,
  fullSleeve: true,
  cuff: C.kurtaTrim,
};

export const KID_SHOULDER_L = {x: -38, y: -256};
export const KID_SHOULDER_R = {x: 38, y: -256};
export const KID_REST_L = {x: -46, y: -152};
export const KID_REST_R = {x: 46, y: -152};

/**
 * The son as a ~7-year-old (flashback): big head, festive yellow kurta, white pyjama.
 * Same rig groups and props as the adults (pose 'stand' only; jumps are done with y).
 */
export const Kid: React.FC<CharacterProps> = (p) => {
  const {frame: f, seed = 8, scale = 1, face = {}} = p;
  const b = breath(f, seed, 1.4) * (p.breathe ?? 1);
  const turn = p.headTurn ?? 0;
  const fx = turn * 11;
  const open = (face.eyeOpen ?? 1) * (face.noBlink ? 1 : autoBlink(f, seed, 88));
  const eyeArgs = {
    rx: 7,
    ry: 9.5,
    open,
    look: face.look ?? {x: 0, y: 0},
    squint: face.squint ?? 0,
    sparkle: face.sparkle ?? 0,
    tears: face.tears ?? 0,
    closedStyle: face.closedStyle ?? 'happy',
    color: C.eye,
    lineColor: C.skinShade,
  } as const;
  const headT = `translate(0 ${(p.headBob ?? 0) - b * 1.5}) rotate(${p.headTilt ?? 0} 0 -282)`;

  return (
    <g className="kid" opacity={p.opacity ?? 1} transform={`translate(${p.x} ${p.y}) scale(${(p.flip ? -1 : 1) * scale} ${scale})`}>
      <g className="lower-body">
        <path d="M -30 -156 L -28 -10 L -5 -10 L -3 -156 Z M 3 -156 L 5 -10 L 28 -10 L 30 -156 Z" fill={C.pants} />
        <ellipse cx={-17} cy={-6} rx={15} ry={7} fill={C.skin} />
        <ellipse cx={17} cy={-6} rx={15} ry={7} fill={C.skin} />
      </g>
      <g className="upper-body" transform={`rotate(${p.lean ?? 0} 0 -150)`}>
        <g className="back-hair" transform={headT}>
          <ellipse cx={0} cy={-346} rx={53} ry={47} fill={C.hair} />
        </g>
        <g className="torso" transform={`translate(0 -150) scale(1 ${1 + b * 0.015}) translate(0 150)`}>
          <path d="M -12 -290 L -13 -258 L 13 -258 L 12 -290 Z" fill={C.skin} />
          <path
            d="M -16 -268 C -36 -268 -46 -262 -48 -246 L -46 -146 Q 0 -138 46 -146 L 48 -246 C 46 -262 36 -268 16 -268 Z"
            fill={C.kurta}
          />
          <path d="M -46 -156 Q 0 -146 46 -156" stroke={C.kurtaTrim} strokeWidth={6} fill="none" />
          <path d="M -14 -270 Q 0 -262 14 -270 L 13 -261 Q 0 -253 -13 -261 Z" fill={C.kurtaTrim} />
          <path d="M 0 -262 L 0 -210" stroke={C.kurtaShade} strokeWidth={5} />
          <circle cx={0} cy={-244} r={2.6} fill={C.kurtaTrim} />
          <circle cx={0} cy={-226} r={2.6} fill={C.kurtaTrim} />
        </g>
        <g className="head" transform={headT}>
          <ellipse cx={-48 + Math.max(0, turn) * 4} cy={-328} rx={8} ry={12} fill={C.skin} opacity={1 - Math.max(0, -turn) * 0.9} />
          <ellipse cx={48 + Math.min(0, turn) * 4} cy={-328} rx={8} ry={12} fill={C.skin} opacity={1 - Math.max(0, turn) * 0.9} />
          <path d="M -48 -336 C -48 -390 48 -390 48 -336 C 48 -298 28 -282 0 -281 C -28 -282 -48 -298 -48 -336 Z" fill={C.skin} />
          <path
            d={`M -53 -330 C -60 -396 60 -396 53 -330 C 46 -350 30 -362 ${14 + fx} -352 C ${4 + fx} -364 ${-14 + fx} -364 ${-24 + fx} -352 C -36 -362 -48 -352 -53 -330 Z`}
            fill={C.hair}
          />
          <g className="face" transform={`translate(${fx} 0)`}>
            <ellipse cx={-28} cy={-308} rx={10} ry={6} fill={C.blush} opacity={0.35 + Math.max(0, face.smile ?? 0) * 0.25} />
            <ellipse cx={28} cy={-308} rx={10} ry={6} fill={C.blush} opacity={0.35 + Math.max(0, face.smile ?? 0) * 0.25} />
            <Eye x={-18} y={-328} {...eyeArgs} />
            <Eye x={18} y={-328} {...eyeArgs} />
            <Brow x={-18} y={-350} w={18} side={-1} raise={face.brow ?? 0} sad={face.sad ?? 0} color={C.hair} thick={4} />
            <Brow x={18} y={-350} w={18} side={1} raise={face.brow ?? 0} sad={face.sad ?? 0} color={C.hair} thick={4} />
            <path
              d={`M ${-1 + turn * 2} -320 Q ${2 + turn * 3} -312 ${5 + turn * 2} -311`}
              stroke={C.skinShade}
              strokeWidth={2.6}
              fill="none"
              strokeLinecap="round"
            />
            <Mouth x={0} y={-298} w={10} smile={face.smile ?? 0} open={face.open ?? 0} color={C.mouth} tongue={C.tongue} />
          </g>
        </g>
        <g className="arm-left">
          <Arm shoulder={KID_SHOULDER_L} pose={p.armL ?? {to: KID_REST_L}} look={ARM} side={-1} />
        </g>
        <g className="arm-right">
          <Arm shoulder={KID_SHOULDER_R} pose={p.armR ?? {to: KID_REST_R}} look={ARM} side={1} />
        </g>
      </g>
    </g>
  );
};
