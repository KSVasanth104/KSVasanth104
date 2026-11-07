// Closing "Happy Diwali" card: a single diya lights up in the dark, a row of small
// diyas follows, then the greeting and a closing line that calls back to the doorbell.
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';
import {END_CARD} from '../timeline';
import {FONT_FAMILY, VIDEO} from '../theme';
import {CLAMP, EASE_OUT, keys, rand} from '../lib/anim';
import {Diya} from './Diya';
import {Fireworks} from '../sets/Props';

const fadeUp = (f: number, start: number) => ({
  opacity: interpolate(f, [start, start + 14], [0, 1], CLAMP),
  transform: `translateY(${interpolate(f, [start, start + 24], [24, 0], {...CLAMP, easing: EASE_OUT})}px)`,
  filter: `blur(${interpolate(f, [start, start + 12], [6, 0], CLAMP)}px)`,
});

/** `f` is the frame relative to the start of the end card. */
export const EndCard: React.FC<{f: number}> = ({f}) => {
  const fadeIn = keys(f, [0, 10], [0, 1]);
  const lit = keys(f, [4, 20], [0, 1], EASE_OUT);
  const warm = keys(f, [4, 40], [0, 1]);
  const T = END_CARD.reveal;

  const sparks = [];
  for (let i = 0; i < 26; i++) {
    const x = 120 + rand(i * 3.7) * 840;
    const speed = 0.8 + rand(i * 1.9) * 1.6;
    const y = 1250 - ((f * speed + rand(i * 5.3) * 700) % 760);
    const o = (0.3 + 0.7 * Math.abs(Math.sin(f / 9 + i))) * warm * Math.min(1, (1250 - y) / 120);
    sparks.push(<circle key={i} cx={x + Math.sin(f / 20 + i) * 14} cy={y} r={2 + rand(i) * 3} fill="#ffd27a" opacity={o} />);
  }

  return (
    <AbsoluteFill style={{opacity: fadeIn, backgroundColor: '#0a0503'}}>
      {/* warm bloom that grows as the diya lights */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 45% at 50% 58%, rgba(255,150,50,${0.38 * warm}) 0%, rgba(120,40,10,${0.3 * warm}) 45%, rgba(0,0,0,0) 80%)`,
        }}
      />
      <svg viewBox={`0 0 ${VIDEO.width} ${VIDEO.height}`} width={VIDEO.width} height={VIDEO.height} style={{position: 'absolute'}}>
        <g opacity={warm * 0.55}>
          <Fireworks frame={f + 1140} x={40} y={80} w={1000} h={260} seed={12} />
        </g>
        {sparks}
        <Diya x={540} y={1110} scale={2.5} frame={f + 1140} seed={31} lit={lit} id="end-main" />
        {[0, 1, 2, 3].map((i) => {
          const x = [250, 380, 700, 830][i];
          const order = [1, 0, 0, 1][i];
          return (
            <Diya
              key={i}
              x={x}
              y={1270}
              scale={0.9}
              frame={f + 1140}
              seed={40 + i}
              lit={keys(f, [16 + order * 8, 28 + order * 8], [0, 1])}
              glow={0.7}
              id={`end-row-${i}`}
            />
          );
        })}
      </svg>

      <div
        style={{
          position: 'absolute',
          left: 90,
          right: 90,
          top: 230,
          textAlign: 'center',
          fontFamily: `'${FONT_FAMILY}', 'Trebuchet MS', sans-serif`,
          fontWeight: 800,
          lineHeight: 1.1,
        }}
      >
        <div
          style={{
            ...fadeUp(f, T.greeting),
            fontSize: 150,
            color: '#ffc65a',
            letterSpacing: -1,
            textShadow: '0 6px 24px rgba(0,0,0,0.6), 0 0 60px rgba(255,160,50,0.75)',
          }}
        >
          {END_CARD.greeting}
        </div>
        <div style={{...fadeUp(f, T.line1), fontSize: 70, color: '#fff4dc', marginTop: 34, textShadow: '0 4px 16px rgba(0,0,0,0.6)'}}>
          {END_CARD.line1}
        </div>
        <div
          style={{
            ...fadeUp(f, T.line2),
            fontSize: 70,
            color: '#ffd89a',
            marginTop: 8,
            whiteSpace: 'pre-line',
            textShadow: '0 4px 16px rgba(0,0,0,0.6), 0 0 34px rgba(255,165,60,0.55)',
          }}
        >
          {END_CARD.line2}
        </div>
      </div>
    </AbsoluteFill>
  );
};
