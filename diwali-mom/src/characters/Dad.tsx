import React from 'react';
import {CHARACTERS} from '../theme';
import {blink as autoBlink, breath} from '../lib/anim';
import {Arm, ArmLook} from '../rig/Arm';
import {Brow, Eye, Mouth} from '../rig/Face';
import type {CharacterProps} from './types';

const C = CHARACTERS.dad;

const ARM: ArmLook = {
  l1: 114,
  l2: 104,
  w1: 30,
  w2: 24,
  w3: 20,
  handR: 15,
  skin: C.skin,
  skinShade: C.skinShade,
  sleeve: C.shirt,
  sleeveShade: C.shirtShade,
  sleeveLen: 0.5,
};

export const DAD_SHOULDER_L = {x: -72, y: -500};
export const DAD_SHOULDER_R = {x: 72, y: -500};
export const DAD_REST_L = {x: -84, y: -290};
export const DAD_REST_R = {x: 84, y: -290};

const SEAT_DROP = {stand: 0, lie: 0, sit: 130, kneel: 230} as const;

/**
 * Dad: Mom's late husband as he was in the flashback (~35): thick moustache,
 * side-parted hair, cream silk shirt and a white veshti with a gold border.
 * Same rig groups and props as Mom and Son.
 */
export const Dad: React.FC<CharacterProps> = (p) => {
  const {frame: f, seed = 5, scale = 1, pose = 'stand', face = {}} = p;
  const b = breath(f, seed) * (p.breathe ?? 1);
  const drop = p.seatDrop ?? SEAT_DROP[pose];
  const turn = p.headTurn ?? 0;
  const fx = turn * 12;
  const open = (face.eyeOpen ?? 1) * (face.noBlink ? 1 : autoBlink(f, seed, 104));
  const eyeArgs = {
    rx: 6,
    ry: 8,
    open,
    look: face.look ?? {x: 0, y: 0},
    squint: face.squint ?? 0,
    sparkle: face.sparkle ?? 0,
    tears: face.tears ?? 0,
    closedStyle: face.closedStyle ?? 'happy',
    color: C.eye,
    lineColor: C.skinShade,
  } as const;
  const headT = `translate(0 ${(p.headBob ?? 0) - b * 2}) rotate(${p.headTilt ?? 0} 0 -548) translate(0 -548) scale(1.1) translate(0 548)`;

  return (
    <g className="dad" opacity={p.opacity ?? 1} transform={`translate(${p.x} ${p.y}) scale(${(p.flip ? -1 : 1) * scale} ${scale})`}>
      <g className="lower-body">
        {pose === 'stand' && (
          <g>
            <ellipse cx={-26} cy={-6} rx={22} ry={9} fill={C.skin} />
            <ellipse cx={26} cy={-6} rx={22} ry={9} fill={C.skin} />
            <path d="M -76 -318 L -82 -16 Q 0 -4 82 -16 L 76 -318 Z" fill={C.veshti} />
            <path d="M 14 -312 L 26 -14" stroke={C.border} strokeWidth={8} />
            <path d="M -2 -300 L 4 -18 M 40 -300 L 50 -20" stroke={C.veshtiShade} strokeWidth={3} />
            <path d="M -82 -36 Q 0 -24 82 -36 L 82 -16 Q 0 -4 -82 -16 Z" fill={C.border} />
          </g>
        )}
        {pose === 'kneel' && (
          <g>
            <path d="M -72 -110 C -110 -88 -138 -54 -140 -12 Q 0 8 140 -12 C 138 -54 110 -88 72 -110 Z" fill={C.veshti} />
            <path d="M -134 -26 Q 0 -10 134 -26" stroke={C.border} strokeWidth={10} fill="none" />
            <ellipse cx={-118} cy={-8} rx={24} ry={9} fill={C.skin} />
          </g>
        )}
      </g>

      <g className="upper-body" transform={`translate(0 ${drop}) rotate(${p.lean ?? 0} 0 -330)`}>
        <g className="back-hair" transform={headT}>
          <ellipse cx={0} cy={-628} rx={56} ry={50} fill={C.hair} />
        </g>
        <g className="torso" transform={`translate(0 -330) scale(${1 + b * 0.006} ${1 + b * 0.013}) translate(0 330)`}>
          <path d="M -17 -574 L -19 -508 L 19 -508 L 17 -574 Z" fill={C.skin} />
          <ellipse cx={0} cy={-552} rx={20} ry={9} fill={C.skinShade} />
          {/* veshti waist under the shirt */}
          <path d="M -76 -330 Q 0 -318 76 -330 L 76 -296 Q 0 -286 -76 -296 Z" fill={C.veshti} />
          <path
            d="M -24 -528 C -58 -528 -80 -518 -84 -494 L -78 -400 C -78 -362 -78 -336 -78 -306 Q 0 -294 78 -306 C 78 -336 78 -362 78 -400 L 84 -494 C 80 -518 58 -528 24 -528 Z"
            fill={C.shirt}
          />
          <path d="M -24 -528 L 0 -490 L 24 -528 L 12 -530 L 0 -508 L -12 -530 Z" fill={C.shirtShade} />
          <path d="M 0 -490 L 0 -304" stroke={C.shirtShade} strokeWidth={4} />
          {[-466, -430, -394, -358].map((y) => (
            <circle key={y} cx={7} cy={y} r={3} fill={C.border} />
          ))}
          <path d="M -46 -440 L -26 -440" stroke={C.shirtShade} strokeWidth={4} strokeLinecap="round" />
        </g>
        <g className="head" transform={headT}>
          <ellipse cx={-54 + Math.max(0, turn) * 4} cy={-606} rx={8} ry={13} fill={C.skin} opacity={1 - Math.max(0, -turn) * 0.9} />
          <ellipse cx={54 + Math.min(0, turn) * 4} cy={-606} rx={8} ry={13} fill={C.skin} opacity={1 - Math.max(0, turn) * 0.9} />
          <path d="M -53 -618 C -53 -674 53 -674 53 -618 C 53 -576 34 -548 0 -546 C -34 -548 -53 -576 -53 -618 Z" fill={C.skin} />
          <path
            d={`M -57 -610 C -64 -678 -18 -702 22 -696 C 56 -690 66 -660 57 -608 C 50 -636 30 -652 ${-16 + fx} -652 C -40 -648 -50 -634 -57 -610 Z`}
            fill={C.hair}
          />
          <path
            d={`M ${-16 + fx} -652 C ${-20 + fx} -668 ${-24 + fx} -680 ${-28 + fx} -690`}
            stroke={C.hairLight}
            strokeWidth={3}
            fill="none"
          />
          <g className="face" transform={`translate(${fx} 0)`}>
            <ellipse cx={-31} cy={-586} rx={10} ry={6} fill={C.blush} opacity={0.12 + Math.max(0, face.smile ?? 0) * 0.25} />
            <ellipse cx={31} cy={-586} rx={10} ry={6} fill={C.blush} opacity={0.12 + Math.max(0, face.smile ?? 0) * 0.25} />
            <Eye x={-20} y={-610} {...eyeArgs} />
            <Eye x={20} y={-610} {...eyeArgs} />
            <Brow x={-20} y={-632} w={23} side={-1} raise={face.brow ?? 0} sad={face.sad ?? 0} color={C.hair} thick={6} />
            <Brow x={20} y={-632} w={23} side={1} raise={face.brow ?? 0} sad={face.sad ?? 0} color={C.hair} thick={6} />
            <circle cx={0} cy={-640} r={3.4} fill="#c4162b" />
            <path
              d={`M ${-1 + turn * 3} -602 Q ${3 + turn * 4} -590 ${7 + turn * 2} -588`}
              stroke={C.skinShade}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
            />
            <Mouth x={0} y={-568} w={12} smile={face.smile ?? 0} open={face.open ?? 0} color={C.mouth} tongue={C.tongue} />
            {/* thick moustache */}
            <path
              d="M -26 -580 Q -14 -592 0 -584 Q 14 -592 26 -580 Q 28 -570 16 -573 Q 7 -578 0 -575 Q -7 -578 -16 -573 Q -28 -570 -26 -580 Z"
              fill={C.hair}
            />
          </g>
        </g>
        <g className="arm-left" transform={`translate(0 ${-b * 1.8})`}>
          <Arm shoulder={DAD_SHOULDER_L} pose={p.armL ?? {to: DAD_REST_L}} look={ARM} side={-1} />
        </g>
        <g className="arm-right" transform={`translate(0 ${-b * 1.8})`}>
          <Arm shoulder={DAD_SHOULDER_R} pose={p.armR ?? {to: DAD_REST_R}} look={ARM} side={1} />
        </g>
      </g>
    </g>
  );
};
