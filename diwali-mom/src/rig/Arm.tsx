import React from 'react';
import {HandProp, HandPropName} from './HandProp';

export type Pt = {x: number; y: number};

const DEG = 180 / Math.PI;

/**
 * Two-bone IK: given a shoulder, a hand target and the bone lengths, returns the
 * absolute angles (degrees, 0 = +x, 90 = pointing down) of the upper arm and forearm.
 * `bend` picks which side the elbow folds to (1 or -1).
 */
export const solveArm = (s: Pt, t: Pt, l1: number, l2: number, bend: 1 | -1) => {
  const dx = t.x - s.x;
  const dy = t.y - s.y;
  let d = Math.hypot(dx, dy);
  d = Math.min(d, l1 + l2 - 0.01);
  d = Math.max(d, Math.abs(l1 - l2) + 0.01);
  const a = Math.atan2(dy, dx);
  const cosB = (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d);
  const b = Math.acos(Math.max(-1, Math.min(1, cosB)));
  const upper = a + bend * b;
  const ex = s.x + l1 * Math.cos(upper);
  const ey = s.y + l1 * Math.sin(upper);
  const tx = s.x + d * Math.cos(a);
  const ty = s.y + d * Math.sin(a);
  const lower = Math.atan2(ty - ey, tx - ex);
  return {upper: upper * DEG, lower: lower * DEG, elbow: {x: ex, y: ey}};
};

/** Tapered capsule pointing down the +y axis. */
export const limbPath = (w1: number, w2: number, len: number) =>
  `M ${-w1 / 2} 0 L ${-w2 / 2} ${len} A ${w2 / 2} ${w2 / 2} 0 0 0 ${w2 / 2} ${len} L ${w1 / 2} 0 A ${w1 / 2} ${w1 / 2} 0 0 0 ${-w1 / 2} 0 Z`;

export type ArmLook = {
  l1: number;
  l2: number;
  w1: number; // shoulder width of the upper arm
  w2: number; // elbow width
  w3: number; // wrist width
  handR: number;
  skin: string;
  skinShade: string;
  /** Sleeve covering the upper arm (0..1 of its length), and optionally the forearm. */
  sleeve: string;
  sleeveShade: string;
  sleeveLen: number;
  fullSleeve?: boolean;
  cuff?: string;
};

export type ArmPose = {
  /** Hand target in the character's local (standing) coordinates. */
  to: Pt;
  bend?: 1 | -1;
  /** Absolute direction (deg) the hand/prop points; default follows the forearm. */
  handAngle?: number;
  prop?: HandPropName;
  /** Flatten the hand into a palm-down "smoothing" pose. */
  flatHand?: boolean;
  /**
   * Optional explicit elbow position. When given, the bones stretch/shrink to hit
   * shoulder → elbow → hand exactly, which fakes foreshortening for arms reaching
   * toward the camera (eating, clasping hands at the chin...).
   */
  elbow?: Pt;
};

/**
 * Rigged arm: <g upper-arm> → <g forearm> → <g hand>, each rotated about its joint.
 */
export const Arm: React.FC<{shoulder: Pt; pose: ArmPose; look: ArmLook; side: 1 | -1}> = ({shoulder, pose, look, side}) => {
  const bend = pose.bend ?? (side === -1 ? 1 : -1);
  let upper: number;
  let lower: number;
  let L = look;
  if (pose.elbow) {
    const e = pose.elbow;
    upper = Math.atan2(e.y - shoulder.y, e.x - shoulder.x) * DEG;
    lower = Math.atan2(pose.to.y - e.y, pose.to.x - e.x) * DEG;
    L = {
      ...look,
      l1: Math.max(10, Math.hypot(e.x - shoulder.x, e.y - shoulder.y)),
      l2: Math.max(10, Math.hypot(pose.to.x - e.x, pose.to.y - e.y)),
    };
  } else {
    ({upper, lower} = solveArm(shoulder, pose.to, look.l1, look.l2, bend));
  }
  const handRot = pose.handAngle === undefined ? 0 : pose.handAngle - lower;
  return (
    <g className="upper-arm" transform={`translate(${shoulder.x} ${shoulder.y}) rotate(${upper - 90})`}>
      <path d={limbPath(L.w1, L.w2, L.l1)} fill={L.fullSleeve ? L.sleeve : L.skin} />
      {!L.fullSleeve && <path d={limbPath(L.w1 + 4, L.w1 * 0.92, L.l1 * L.sleeveLen)} fill={L.sleeve} />}
      {L.fullSleeve && (
        <path
          d={`M ${L.w1 * 0.1} 6 L ${L.w2 * 0.25} ${L.l1 - 4}`}
          stroke={L.sleeveShade}
          strokeWidth={3}
          strokeLinecap="round"
          opacity={0.6}
        />
      )}
      <g className="forearm" transform={`translate(0 ${L.l1}) rotate(${lower - upper})`}>
        <circle r={L.w2 / 2} fill={L.fullSleeve ? L.sleeve : L.skin} />
        <path d={limbPath(L.w2, L.w3, L.l2)} fill={L.fullSleeve ? L.sleeve : L.skin} />
        {L.fullSleeve && L.cuff && <rect x={-L.w3 / 2 - 1.5} y={L.l2 - 12} width={L.w3 + 3} height={8} rx={3} fill={L.cuff} />}
        <g className="hand" transform={`translate(0 ${L.l2}) rotate(${handRot})`}>
          {pose.prop && pose.prop !== 'none' && <HandProp name={pose.prop} r={L.handR} side={side} />}
          {pose.flatHand ? (
            <ellipse cx={0} cy={L.handR * 0.7} rx={L.handR * 0.75} ry={L.handR * 1.25} fill={L.skin} />
          ) : (
            <>
              <ellipse cx={0} cy={L.handR * 0.55} rx={L.handR * 0.92} ry={L.handR} fill={L.skin} />
              <ellipse
                cx={-side * L.handR * 0.75}
                cy={L.handR * 0.2}
                rx={L.handR * 0.32}
                ry={L.handR * 0.5}
                fill={L.skin}
                transform={`rotate(${side * 25} ${-side * L.handR * 0.75} ${L.handR * 0.2})`}
              />
              <path
                d={`M ${-L.handR * 0.45} ${L.handR * 1.05} Q 0 ${L.handR * 1.3} ${L.handR * 0.45} ${L.handR * 1.05}`}
                stroke={L.skinShade}
                strokeWidth={2}
                fill="none"
                opacity={0.55}
              />
            </>
          )}
        </g>
      </g>
    </g>
  );
};
