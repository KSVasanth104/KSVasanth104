// Reusable set dressing: furniture, window, wall clock, photo, food, garlands.
import React from 'react';
import {FESTIVE, Palette} from '../theme';
import {flicker, rand} from '../lib/anim';
import {Glow} from '../components/Diya';

export const Chair: React.FC<{x: number; floorY: number; p: Palette; w?: number}> = ({x, floorY, p, w = 170}) => {
  const top = floorY - 520;
  const seat = floorY - 240;
  const l = x - w / 2;
  const r = x + w / 2;
  return (
    <g className="chair">
      <rect x={l} y={top} width={18} height={520} rx={6} fill={p.woodDark} />
      <rect x={r - 18} y={top} width={18} height={520} rx={6} fill={p.woodDark} />
      <rect x={l - 6} y={top - 8} width={w + 12} height={30} rx={12} fill={p.wood} />
      <rect x={l} y={top + 80} width={w} height={14} rx={6} fill={p.woodDark} />
      {[0.3, 0.5, 0.7].map((k) => (
        <rect key={k} x={l + w * k - 6} y={top + 20} width={12} height={62} fill={p.woodDark} />
      ))}
      <path d={`M ${l - 12} ${seat} L ${r + 12} ${seat} L ${r + 22} ${seat + 26} L ${l - 22} ${seat + 26} Z`} fill={p.wood} />
      <rect x={l - 18} y={seat + 26} width={16} height={240 - 26} rx={5} fill={p.woodDark} />
      <rect x={r + 2} y={seat + 26} width={16} height={240 - 26} rx={5} fill={p.woodDark} />
    </g>
  );
};

/** Night window with grill; contents (moon, fireworks, diyas) passed as children. */
export const Window: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  p: Palette;
  id: string;
  children?: React.ReactNode;
  curtain?: boolean;
}> = ({x, y, w, h, p, id, children, curtain = true}) => (
  <g className="window">
    <defs>
      <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={p.sky} />
        <stop offset="100%" stopColor={p.skyLow} />
      </linearGradient>
      <clipPath id={`${id}-clip`}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
    </defs>
    <rect x={x - 18} y={y - 18} width={w + 36} height={h + 36} rx={6} fill={p.woodDark} />
    <rect x={x} y={y} width={w} height={h} fill={`url(#${id}-sky)`} />
    <g clipPath={`url(#${id}-clip)`}>{children}</g>
    {[0.25, 0.5, 0.75].map((k) => (
      <rect key={k} x={x + w * k - 3} y={y} width={6} height={h} fill={p.woodDark} opacity={0.9} />
    ))}
    <rect x={x} y={y + h * 0.5 - 4} width={w} height={8} fill={p.woodDark} />
    <rect x={x - 34} y={y + h + 12} width={w + 68} height={24} rx={6} fill={p.wood} />
    {curtain && (
      <path
        d={`M ${x + w + 4} ${y - 30} C ${x + w + 40} ${y + h * 0.3} ${x + w + 10} ${y + h * 0.6} ${x + w + 46} ${y + h + 40} L ${x + w + 86} ${y + h + 40} C ${x + w + 70} ${y + h * 0.5} ${x + w + 80} ${y + h * 0.2} ${x + w + 70} ${y - 30} Z`}
        fill={p.fabric}
      />
    )}
  </g>
);

export const Moon: React.FC<{x: number; y: number; r: number; color: string; sky: string}> = ({x, y, r, color, sky}) => (
  <g>
    <circle cx={x} cy={y} r={r * 1.8} fill={color} opacity={0.05} />
    <circle cx={x} cy={y} r={r} fill={color} opacity={0.9} />
    <circle cx={x + r * 0.45} cy={y - r * 0.2} r={r * 0.85} fill={sky} />
  </g>
);

/** Distant Diwali fireworks bursting (loop). */
export const Fireworks: React.FC<{frame: number; x: number; y: number; w: number; h: number; seed?: number}> = ({
  frame,
  x,
  y,
  w,
  h,
  seed = 0,
}) => {
  const bursts = [];
  const colors = [FESTIVE.fireworkA, FESTIVE.fireworkB, FESTIVE.fireworkC];
  for (let i = 0; i < 3; i++) {
    const period = 46 + i * 9;
    const t = ((frame + i * 19 + seed * 7) % period) / period;
    const cycle = Math.floor((frame + i * 19 + seed * 7) / period);
    const cx = x + w * (0.2 + rand(cycle * 3 + i + seed) * 0.6);
    const cy = y + h * (0.18 + rand(cycle * 5 + i * 2 + seed) * 0.4);
    const R = 14 + t * 46;
    const o = t < 0.15 ? t / 0.15 : Math.max(0, 1 - (t - 0.15) / 0.85);
    const c = colors[(cycle + i) % 3];
    const rays = [];
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI * 2;
      rays.push(
        <line
          key={k}
          x1={cx + Math.cos(a) * R * 0.55}
          y1={cy + Math.sin(a) * R * 0.55 + t * 8}
          x2={cx + Math.cos(a) * R}
          y2={cy + Math.sin(a) * R + t * 12}
          stroke={c}
          strokeWidth={3}
          strokeLinecap="round"
        />,
      );
    }
    bursts.push(
      <g key={i} opacity={o}>
        <circle cx={cx} cy={cy} r={R * 0.9} fill={c} opacity={0.12} />
        {rays}
      </g>,
    );
  }
  return <g className="fireworks">{bursts}</g>;
};

/** Ticking wall clock (second hand ticks every 30 frames). */
export const WallClock: React.FC<{x: number; y: number; r: number; p: Palette; frame: number}> = ({x, y, r, p, frame}) => {
  const sec = Math.floor(frame / 30) * 6 + Math.min(1, (frame % 30) / 4) * 6 - 6 + 30;
  return (
    <g className="clock" transform={`translate(${x} ${y})`}>
      <circle r={r + 10} fill={p.woodDark} />
      <circle r={r} fill={p.sheet} />
      {Array.from({length: 12}).map((_, i) => (
        <rect key={i} x={-2} y={-r + 6} width={4} height={i % 3 === 0 ? 12 : 7} fill={p.woodDark} transform={`rotate(${i * 30})`} />
      ))}
      <rect x={-3.5} y={-r * 0.5} width={7} height={r * 0.55} rx={3} fill={p.woodDark} transform="rotate(-62)" />
      <rect x={-2.5} y={-r * 0.78} width={5} height={r * 0.83} rx={2} fill={p.woodDark} transform="rotate(298)" />
      <rect x={-1} y={-r * 0.85} width={2} height={r} fill={p.accent2} transform={`rotate(${sec})`} />
      <circle r={5} fill={p.woodDark} />
    </g>
  );
};

/** Framed photo of the late husband with a flower garland. */
export const MemorialPhoto: React.FC<{x: number; y: number; p: Palette}> = ({x, y, p}) => {
  const w = 150;
  const h = 180;
  const beads = [];
  for (let i = 0; i <= 14; i++) {
    const t = i / 14;
    const bx = x - w / 2 + 10 + t * (w - 20);
    const by = y + h * 0.55 + Math.sin(t * Math.PI) * 70;
    beads.push(<circle key={i} cx={bx} cy={by} r={8.5} fill={i % 2 ? '#f3ecdc' : '#e9b85a'} />);
  }
  return (
    <g className="memorial-photo">
      <rect x={x - w / 2 - 14} y={y - 14} width={w + 28} height={h + 28} rx={4} fill={p.woodDark} />
      <rect x={x - w / 2} y={y} width={w} height={h} fill="#b7a184" />
      {/* simple portrait: shoulders, head, moustache */}
      <path d={`M ${x - 62} ${y + h} C ${x - 58} ${y + 120} ${x + 58} ${y + 120} ${x + 62} ${y + h} Z`} fill="#6e5a48" />
      <ellipse cx={x} cy={y + 82} rx={34} ry={40} fill="#a2846a" />
      <circle cx={x - 12} cy={y + 80} r={3.5} fill="#3e3128" />
      <circle cx={x + 12} cy={y + 80} r={3.5} fill="#3e3128" />
      <path
        d={`M ${x - 10} ${y + 108} Q ${x} ${y + 113} ${x + 10} ${y + 108}`}
        stroke="#5d4a3b"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M ${x - 34} ${y + 74} C ${x - 36} ${y + 34} ${x + 36} ${y + 34} ${x + 34} ${y + 74} C ${x + 20} ${y + 56} ${x - 20} ${y + 56} ${x - 34} ${y + 74} Z`}
        fill="#4f4034"
      />
      <path
        d={`M ${x - 16} ${y + 98} Q ${x} ${y + 92} ${x + 16} ${y + 98}`}
        stroke="#4f4034"
        strokeWidth={6}
        strokeLinecap="round"
        fill="none"
      />
      <circle cx={x} cy={y + 64} r={3.5} fill="#b13b2e" />
      {beads}
    </g>
  );
};

/** Hanging bare bulb with glow. */
export const Bulb: React.FC<{x: number; y: number; p: Palette; frame: number; intensity: number}> = ({x, y, p, frame, intensity}) => {
  const fl = 1 + flicker(frame, 9) * 0.025;
  return (
    <g className="bulb">
      <line x1={x} y1={-300} x2={x} y2={y - 18} stroke={p.shadow} strokeWidth={3} />
      <rect x={x - 9} y={y - 26} width={18} height={18} rx={3} fill={p.woodDark} />
      <Glow x={x} y={y} r={620} color={p.light} opacity={0.42 * intensity * fl} id="bulb-glow" />
      <circle cx={x} cy={y} r={20} fill={p.light} opacity={0.95} />
      <circle cx={x - 6} cy={y - 6} r={7} fill="#ffffff" opacity={0.7} />
    </g>
  );
};

/** Marigold toran with mango leaves (Diwali door/window decoration). */
export const Toran: React.FC<{x1: number; x2: number; y: number; sag?: number; scale?: number}> = ({x1, x2, y, sag = 26, scale = 1}) => {
  const n = Math.round((x2 - x1) / (26 * scale));
  const items = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const cx = x1 + (x2 - x1) * t;
    const cy = y + Math.sin(t * Math.PI) * sag;
    if (i % 3 === 1) {
      items.push(
        <path
          key={`l${i}`}
          d={`M ${cx} ${cy} q ${-9 * scale} ${22 * scale} 0 ${40 * scale} q ${9 * scale} ${-18 * scale} 0 ${-40 * scale} Z`}
          fill="#4d8a37"
        />,
      );
    }
    items.push(<circle key={i} cx={cx} cy={cy} r={12 * scale} fill={i % 2 ? FESTIVE.marigold : FESTIVE.marigoldDark} />);
  }
  return <g className="toran">{items}</g>;
};

/** Little string of fairy lights that twinkle. */
export const FairyLights: React.FC<{x1: number; x2: number; y: number; sag: number; frame: number; count?: number; opacity?: number}> = ({
  x1,
  x2,
  y,
  sag,
  frame,
  count = 14,
  opacity = 1,
}) => {
  const bulbs = [];
  const pts = [];
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const cx = x1 + (x2 - x1) * t;
    const cy = y + Math.sin(t * Math.PI) * sag;
    pts.push(`${cx},${cy}`);
    const on = 0.55 + 0.45 * Math.sin(frame / 7 + i * 1.9);
    const c = [FESTIVE.fireworkA, FESTIVE.flameOuter, FESTIVE.fireworkB][i % 3];
    bulbs.push(
      <g key={i} opacity={on}>
        <circle cx={cx} cy={cy + 6} r={16} fill={c} opacity={0.25} />
        <circle cx={cx} cy={cy + 6} r={6} fill={c} />
      </g>,
    );
  }
  return (
    <g opacity={opacity}>
      <polyline points={pts.join(' ')} stroke="#3a2a1c" strokeWidth={2} fill="none" />
      {bulbs}
    </g>
  );
};

/* ------------------------------ food ------------------------------ */

export const SteelPlate: React.FC<{x: number; y: number; rx: number; p: Palette; children?: React.ReactNode}> = ({
  x,
  y,
  rx,
  p,
  children,
}) => (
  <g className="plate">
    <ellipse cx={x} cy={y + 4} rx={rx} ry={rx * 0.24} fill={p.shadow} opacity={0.25} />
    <ellipse cx={x} cy={y} rx={rx} ry={rx * 0.24} fill={p.steelDark} />
    <ellipse cx={x} cy={y - 3} rx={rx * 0.86} ry={rx * 0.19} fill={p.steel} />
    {children}
  </g>
);

export const RiceMound: React.FC<{x: number; y: number; w: number; p: Palette}> = ({x, y, w, p}) => (
  <g>
    <path d={`M ${x - w} ${y} C ${x - w * 0.8} ${y - w * 0.5} ${x + w * 0.8} ${y - w * 0.55} ${x + w} ${y} Z`} fill={p.food} />
    <path
      d={`M ${x - w * 0.5} ${y - w * 0.22} Q ${x} ${y - w * 0.36} ${x + w * 0.4} ${y - w * 0.24}`}
      stroke={p.foodShade}
      strokeWidth={3}
      fill="none"
    />
  </g>
);

export const Tumbler: React.FC<{x: number; y: number; p: Palette}> = ({x, y, p}) => (
  <g>
    <path d={`M ${x - 20} ${y - 56} L ${x - 16} ${y} L ${x + 16} ${y} L ${x + 20} ${y - 56} Z`} fill={p.steel} />
    <ellipse cx={x} cy={y - 56} rx={20} ry={5} fill={p.steelDark} />
    <rect x={x - 12} y={y - 50} width={5} height={44} fill="#ffffff" opacity={0.35} />
  </g>
);

export const Bowl: React.FC<{x: number; y: number; w: number; fill: string; p: Palette; s?: number}> = ({x, y, w, fill, p, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
    <path d={`M ${x - w} ${y - 10} Q ${x} ${y + w * 0.75} ${x + w} ${y - 10} Z`} fill={p.steel} />
    <ellipse cx={x} cy={y - 10} rx={w} ry={w * 0.22} fill={p.steelDark} />
    <ellipse cx={x} cy={y - 9} rx={w * 0.88} ry={w * 0.17} fill={fill} />
  </g>
);

export const Laddoo: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={FESTIVE.laddoo} />
    <circle cx={x + r * 0.15} cy={y + r * 0.15} r={r * 0.85} fill={FESTIVE.laddooShade} opacity={0.35} />
    <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.28} fill="#ffd27a" />
    {[0, 1, 2, 3].map((k) => (
      <circle key={k} cx={x + Math.cos(k * 1.7) * r * 0.55} cy={y + Math.sin(k * 1.7) * r * 0.5} r={r * 0.08} fill="#fff1c4" />
    ))}
  </g>
);

export const Jalebi: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => {
  let d = '';
  for (let i = 0; i <= 40; i++) {
    const a = (i / 40) * Math.PI * 4.2;
    const rr = r * (0.15 + (i / 40) * 0.85);
    d += `${i === 0 ? 'M' : 'L'} ${x + Math.cos(a) * rr} ${y + Math.sin(a) * rr * 0.8} `;
  }
  return (
    <g>
      <path d={d} stroke={FESTIVE.jalebiShade} strokeWidth={r * 0.36} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={FESTIVE.jalebi} strokeWidth={r * 0.22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
};

export const Barfi: React.FC<{x: number; y: number; r: number; rot?: number}> = ({x, y, r, rot = 0}) => (
  <g transform={`rotate(${rot} ${x} ${y})`}>
    <path d={`M ${x} ${y - r} L ${x + r * 1.3} ${y} L ${x} ${y + r} L ${x - r * 1.3} ${y} Z`} fill={FESTIVE.barfi} />
    <path
      d={`M ${x} ${y - r * 0.7} L ${x + r * 0.9} ${y} L ${x} ${y + r * 0.7} L ${x - r * 0.9} ${y} Z`}
      fill={FESTIVE.silver}
      opacity={0.8}
    />
  </g>
);

export const PuriStack: React.FC<{x: number; y: number; w: number}> = ({x, y, w}) => (
  <g>
    {[0, 1, 2].map((k) => (
      <ellipse key={k} cx={x + (k - 1) * 6} cy={y - k * 12} rx={w} ry={w * 0.32} fill={k % 2 ? FESTIVE.puriShade : FESTIVE.puri} />
    ))}
    <ellipse cx={x - w * 0.25} cy={y - 26} rx={w * 0.4} ry={w * 0.1} fill="#f6d79a" />
  </g>
);

export const Petals: React.FC<{x: number; y: number; w: number; h: number; seed?: number; n?: number}> = ({
  x,
  y,
  w,
  h,
  seed = 0,
  n = 14,
}) => (
  <g>
    {Array.from({length: n}).map((_, i) => (
      <ellipse
        key={i}
        cx={x + rand(i * 2.3 + seed) * w}
        cy={y + rand(i * 4.1 + seed) * h}
        rx={6}
        ry={3.5}
        fill={i % 3 ? FESTIVE.marigold : FESTIVE.rangoliPink}
        transform={`rotate(${rand(i + seed) * 180} ${x + rand(i * 2.3 + seed) * w} ${y + rand(i * 4.1 + seed) * h})`}
      />
    ))}
  </g>
);
