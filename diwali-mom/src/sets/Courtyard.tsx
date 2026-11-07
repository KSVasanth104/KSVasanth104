// The front of the family home on a Diwali night years ago (flashback, scene 3b).
import React from 'react';
import {FESTIVE, Palette} from '../theme';
import {rand} from '../lib/anim';
import {Diya, Glow} from '../components/Diya';
import {FairyLights, Fireworks, Toran} from './Props';

export const COURTYARD = {groundY: 1560, door: {x1: 440, x2: 640, top: 1080, bottom: 1530}, kolam: {x: 540, y: 1770}};

const Kolam: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y}) scale(1 0.32)`}>
    <circle r={300} fill="#f6efe0" opacity={0.9} />
    <circle r={270} fill={FESTIVE.rangoliPink} />
    <circle r={220} fill={FESTIVE.marigold} />
    {Array.from({length: 12}).map((_, i) => (
      <ellipse key={i} cx={0} cy={-160} rx={34} ry={64} fill={FESTIVE.rangoliBlue} transform={`rotate(${i * 30})`} />
    ))}
    <circle r={110} fill={FESTIVE.rangoliGreen} />
    <circle r={60} fill="#fff4dc" />
    {Array.from({length: 24}).map((_, i) => {
      const a = (i / 24) * Math.PI * 2;
      return <circle key={`d${i}`} cx={Math.cos(a) * 285} cy={Math.sin(a) * 285} r={9} fill="#fffaf0" />;
    })}
  </g>
);

export const Courtyard: React.FC<{p: Palette; frame: number; children?: React.ReactNode; front?: React.ReactNode; id: string}> = ({
  p,
  frame,
  children,
  front,
  id,
}) => {
  const {door} = COURTYARD;
  return (
    <g className="courtyard">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1b1233" />
          <stop offset="100%" stopColor="#5a2d4a" />
        </linearGradient>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e39a55" />
          <stop offset="100%" stopColor="#bd6d38" />
        </linearGradient>
        <linearGradient id={`${id}-ground`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8653a" />
          <stop offset="100%" stopColor="#6e3a1e" />
        </linearGradient>
      </defs>

      {/* night sky with stars and fireworks */}
      <rect x={-300} y={-400} width={1680} height={1300} fill={`url(#${id}-sky)`} />
      {Array.from({length: 40}).map((_, i) => (
        <circle
          key={i}
          cx={rand(i * 2.1) * 1080}
          cy={rand(i * 3.7) * 640}
          r={1.5 + rand(i) * 2}
          fill="#fff6dc"
          opacity={0.4 + 0.5 * Math.abs(Math.sin(frame / 15 + i))}
        />
      ))}
      <g transform="scale(2)">
        <Fireworks frame={frame} x={0} y={120} w={540} h={150} seed={21} />
      </g>
      <g transform="translate(140 60) scale(1.5)">
        <Fireworks frame={frame + 23} x={0} y={170} w={560} h={170} seed={33} />
      </g>

      {/* house facade */}
      <rect x={60} y={700} width={960} height={860} fill={`url(#${id}-wall)`} />
      <path d="M 20 720 L 1060 720 L 1020 640 L 60 640 Z" fill="#9c3f26" />
      {Array.from({length: 26}).map((_, i) => (
        <path key={i} d={`M ${30 + i * 40} 720 q 20 18 40 0`} fill="#86331d" />
      ))}
      <FairyLights x1={60} x2={1020} y={735} sag={40} frame={frame} count={20} />

      {/* open door with warm light inside */}
      <rect x={door.x1 - 26} y={door.top - 26} width={door.x2 - door.x1 + 52} height={door.bottom - door.top + 26} fill={p.woodDark} />
      <rect x={door.x1} y={door.top} width={door.x2 - door.x1} height={door.bottom - door.top} fill="#ffd894" />
      <Glow x={(door.x1 + door.x2) / 2} y={1300} r={420} color="#ffd28c" opacity={0.5} id={`${id}-doorglow`} />
      <path
        d={`M ${door.x1} ${door.top} L ${door.x1 + 46} ${door.top + 20} L ${door.x1 + 46} ${door.bottom + 6} L ${door.x1} ${door.bottom} Z`}
        fill={p.wood}
      />
      <path
        d={`M ${door.x2} ${door.top} L ${door.x2 - 46} ${door.top + 20} L ${door.x2 - 46} ${door.bottom + 6} L ${door.x2} ${door.bottom} Z`}
        fill={p.wood}
      />
      <Toran x1={door.x1 - 30} x2={door.x2 + 30} y={door.top - 18} sag={26} />

      {/* windows with diyas */}
      {[150, 750].map((wx, k) => (
        <g key={wx}>
          <rect x={wx - 16} y={900 - 16} width={212} height={282} fill={p.woodDark} />
          <rect x={wx} y={900} width={180} height={250} fill="#ffcf85" />
          {[0.33, 0.66].map((t) => (
            <rect key={t} x={wx + 180 * t - 3} y={900} width={6} height={250} fill={p.woodDark} />
          ))}
          <rect x={wx - 30} y={1160} width={240} height={20} fill={p.wood} />
          {[0, 1, 2].map((i) => (
            <Diya key={i} x={wx + 30 + i * 60} y={1160} scale={0.5} frame={frame} seed={k * 5 + i} id={`${id}-wd${k}${i}`} />
          ))}
        </g>
      ))}

      {/* steps and ground */}
      <rect x={60} y={1500} width={960} height={60} fill="#9a5530" />
      <rect x={400} y={1530} width={280} height={30} fill="#c98a5a" />
      <rect x={-300} y={COURTYARD.groundY} width={1680} height={800} fill={`url(#${id}-ground)`} />
      <Kolam x={COURTYARD.kolam.x} y={COURTYARD.kolam.y} />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2 + 0.5;
        return (
          <Diya
            key={i}
            x={COURTYARD.kolam.x + Math.cos(a) * 330 - 20}
            y={COURTYARD.kolam.y + Math.sin(a) * 110 + 8}
            scale={0.5}
            frame={frame}
            seed={i + 20}
            id={`${id}-kd${i}`}
          />
        );
      })}

      {children}
      {front}
    </g>
  );
};
