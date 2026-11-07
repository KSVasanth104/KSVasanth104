// Bedroom seen from the ceiling (top-down). Used for scene 3 (Mom alone in her bed)
// and scenes 7-8 (the son asleep in her bed, Mom on a mat on the floor).
import React from 'react';
import {Palette} from '../theme';
import {Diya, Glow} from '../components/Diya';

export const TOPDOWN = {
  bed: {x: 470, y: 380, w: 540, h: 1180},
  pillow: {x: 740, y: 545},
  mat: {x: 70, y: 640, w: 370, h: 1100},
  matPillow: {x: 255, y: 760},
  nightstand: {x: 130, y: 330, w: 280, h: 230},
};

const Floor: React.FC<{p: Palette}> = ({p}) => (
  <g>
    <rect x={-400} y={-400} width={1880} height={2720} fill={p.floor} />
    {Array.from({length: 22}).map((_, i) => (
      <line key={i} x1={-400 + i * 90} y1={-400} x2={-400 + i * 90} y2={2320} stroke={p.floorLine} strokeWidth={3} opacity={0.45} />
    ))}
    {Array.from({length: 22}).map((_, i) => {
      const x = -400 + i * 90;
      const off = (i % 3) * 260;
      return [0, 1, 2, 3].map((k) => (
        <line
          key={`${i}-${k}`}
          x1={x}
          y1={-200 + off + k * 700}
          x2={x + 90}
          y2={-200 + off + k * 700}
          stroke={p.floorLine}
          strokeWidth={3}
          opacity={0.4}
        />
      ));
    })}
  </g>
);

export const BedroomTopDown: React.FC<{
  p: Palette;
  frame: number;
  /** Who is under the blanket in the bed (rendered between pillow and blanket). */
  bedOccupant?: React.ReactNode;
  /** Mom on the floor mat (rendered between mat pillow and blanket). */
  matOccupant?: React.ReactNode;
  showMat: boolean;
  showPhone: boolean;
  diya: number;
  moonlight: number;
  /** 0..1 breathing value for the blankets. */
  breathBed?: number;
  breathMat?: number;
  id: string;
}> = ({p, frame, bedOccupant, matOccupant, showMat, showPhone, diya, moonlight, breathBed = 0, breathMat = 0, id}) => {
  const {bed, mat, nightstand: ns} = TOPDOWN;
  return (
    <g className="bedroom-topdown">
      <Floor p={p} />

      {/* rug under the bed */}
      <rect x={bed.x - 40} y={bed.y + 200} width={bed.w + 80} height={bed.h - 160} rx={30} fill={p.fabricDark} opacity={0.6} />

      {/* nightstand with phone and glasses */}
      <g className="nightstand">
        <rect x={ns.x + 10} y={ns.y + 14} width={ns.w} height={ns.h} rx={14} fill={p.shadow} opacity={0.35} />
        <rect x={ns.x} y={ns.y} width={ns.w} height={ns.h} rx={14} fill={p.wood} />
        <rect x={ns.x + 16} y={ns.y + 16} width={ns.w - 32} height={ns.h - 32} rx={8} fill={p.woodLight} opacity={0.35} />
        {/* spectacles */}
        <g transform={`translate(${ns.x + 70} ${ns.y + 160}) rotate(-12)`} stroke={p.steelDark} strokeWidth={4} fill="none">
          <circle cx={-22} cy={0} r={18} />
          <circle cx={22} cy={0} r={18} />
          <path d="M -4 0 L 4 0" />
        </g>
        {showPhone && (
          <g transform={`translate(${ns.x + 190} ${ns.y + 110}) rotate(14)`}>
            <rect x={-38} y={-70} width={76} height={140} rx={14} fill="#10131a" />
            <rect x={-32} y={-62} width={64} height={124} rx={9} fill="#1b2130" />
            <path d="M -28 -50 L 10 -58 L 28 -40 L -20 -20 Z" fill="#ffffff" opacity={0.06} />
          </g>
        )}
        {diya > 0 && <Diya x={ns.x + 80} y={ns.y + 100} scale={0.8} frame={frame} seed={11} lit={diya} id={`${id}-ns-diya`} />}
      </g>

      {/* bed */}
      <g className="bed">
        <rect x={bed.x + 14} y={bed.y + 18} width={bed.w} height={bed.h} rx={20} fill={p.shadow} opacity={0.4} />
        <rect x={bed.x} y={bed.y} width={bed.w} height={bed.h} rx={20} fill={p.woodDark} />
        <rect x={bed.x} y={bed.y} width={bed.w} height={60} rx={18} fill={p.wood} />
        <rect x={bed.x + 18} y={bed.y + 62} width={bed.w - 36} height={bed.h - 80} rx={14} fill={p.sheet} />
        <ellipse cx={TOPDOWN.pillow.x} cy={TOPDOWN.pillow.y - 4} rx={160} ry={64} fill={p.food} opacity={0.85} />
        <path
          d={`M ${TOPDOWN.pillow.x - 120} ${TOPDOWN.pillow.y + 34} Q ${TOPDOWN.pillow.x} ${TOPDOWN.pillow.y + 52} ${TOPDOWN.pillow.x + 120} ${TOPDOWN.pillow.y + 34}`}
          stroke={p.sheetShade}
          strokeWidth={6}
          fill="none"
          opacity={0.6}
        />
        {bedOccupant}
        <g transform={`translate(0 ${760}) scale(1 ${1 + breathBed * 0.006}) translate(0 ${-760})`}>
          <path
            d={`M ${bed.x + 8} 760 Q ${bed.x + bed.w / 2} 742 ${bed.x + bed.w - 8} 760 L ${bed.x + bed.w + 6} ${bed.y + bed.h - 6} Q ${bed.x + bed.w / 2} ${bed.y + bed.h + 14} ${bed.x - 6} ${bed.y + bed.h - 6} Z`}
            fill={p.fabric}
          />
          <path
            d={`M ${bed.x + 8} 760 Q ${bed.x + bed.w / 2} 742 ${bed.x + bed.w - 8} 760 L ${bed.x + bed.w - 4} 815 Q ${bed.x + bed.w / 2} 800 ${bed.x + 4} 815 Z`}
            fill={p.sheet}
          />
          {[0, 1, 2, 3, 4].map((k) => (
            <path
              key={k}
              d={`M ${bed.x + 20} ${880 + k * 140} Q ${bed.x + bed.w / 2} ${900 + k * 140} ${bed.x + bed.w - 20} ${880 + k * 140}`}
              stroke={p.fabricDark}
              strokeWidth={5}
              fill="none"
              opacity={0.55}
            />
          ))}
          <path
            d={`M ${bed.x + 150} 840 Q ${bed.x + 170} 1100 ${bed.x + 140} 1500`}
            stroke={p.fabricLight}
            strokeWidth={6}
            fill="none"
            opacity={0.4}
          />
        </g>
      </g>

      {/* the mat on the floor */}
      {showMat && (
        <g className="floor-mat">
          <rect x={mat.x + 10} y={mat.y + 14} width={mat.w} height={mat.h} rx={16} fill={p.shadow} opacity={0.35} />
          <rect x={mat.x} y={mat.y} width={mat.w} height={mat.h} rx={16} fill={p.woodLight} />
          {Array.from({length: 24}).map((_, i) => (
            <line
              key={i}
              x1={mat.x + 8}
              y1={mat.y + 30 + i * 44}
              x2={mat.x + mat.w - 8}
              y2={mat.y + 30 + i * 44}
              stroke={p.wood}
              strokeWidth={3}
              opacity={0.5}
            />
          ))}
          <rect
            x={mat.x + 14}
            y={mat.y + 12}
            width={mat.w - 28}
            height={mat.h - 24}
            rx={10}
            fill="none"
            stroke={p.accent2}
            strokeWidth={8}
            opacity={0.7}
          />
          <ellipse cx={TOPDOWN.matPillow.x} cy={TOPDOWN.matPillow.y - 4} rx={112} ry={46} fill={p.food} opacity={0.9} />
          {matOccupant}
          <g transform={`translate(0 940) scale(1 ${1 + breathMat * 0.007}) translate(0 -940)`}>
            <path
              d={`M ${mat.x + 6} 940 Q ${mat.x + mat.w / 2} 924 ${mat.x + mat.w - 6} 940 L ${mat.x + mat.w - 12} ${mat.y + mat.h - 30} Q ${mat.x + mat.w / 2} ${mat.y + mat.h - 16} ${mat.x + 12} ${mat.y + mat.h - 30} Z`}
              fill={p.accent2}
            />
            <path
              d={`M ${mat.x + 6} 940 Q ${mat.x + mat.w / 2} 924 ${mat.x + mat.w - 6} 940 L ${mat.x + mat.w - 8} 980 Q ${mat.x + mat.w / 2} 966 ${mat.x + 8} 980 Z`}
              fill={p.accent}
            />
            {[0, 1, 2, 3].map((k) => (
              <path
                key={k}
                d={`M ${mat.x + 20} ${1080 + k * 150} Q ${mat.x + mat.w / 2} ${1094 + k * 150} ${mat.x + mat.w - 20} ${1080 + k * 150}`}
                stroke={p.fabricDark}
                strokeWidth={5}
                fill="none"
                opacity={0.4}
              />
            ))}
          </g>
        </g>
      )}

      {/* moonlight from the window falling across the bed */}
      {moonlight > 0 && (
        <g opacity={moonlight}>
          <path d="M 380 900 L 900 820 L 1120 1300 L 560 1420 Z" fill={p.light} opacity={0.12} />
          <path d="M 640 860 L 840 1360 M 470 1140 L 1000 1050" stroke={p.shadow} strokeWidth={14} opacity={0.12} />
        </g>
      )}
      {diya > 0 && <Glow x={ns.x + 120} y={ns.y + 80} r={900} color={p.lightSoft} opacity={0.22 * diya} id={`${id}-room-glow`} />}
    </g>
  );
};
