// Turnaround of the two rigs (for look development in Remotion Studio).
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Mom} from './characters/Mom';
import {Son} from './characters/Son';
import {Stage} from './components/Camera';
import {keys, wave} from './lib/anim';

export const CharacterSheet: React.FC = () => {
  const f = useCurrentFrame();
  const smile = keys(f, [0, 40, 80, 120], [-0.4, 1, 1, 0]);
  const wv = wave(f, 30);
  return (
    <AbsoluteFill style={{background: '#efe4d2'}}>
      <Stage>
        <rect x={0} y={1180} width={1080} height={10} fill="#d8c6aa" />
        <Mom
          frame={f}
          x={290}
          y={1180}
          scale={1.25}
          headTurn={wv * 0.6}
          armR={{to: {x: 120, y: -470 + wv * 30}}}
          face={{smile, open: keys(f, [40, 60, 80], [0, 0.7, 0]), sparkle: keys(f, [40, 60], [0, 1]), squint: keys(f, [50, 60], [0, 0.6])}}
        />
        <Son frame={f} x={780} y={1180} scale={1.05} headTurn={-wv * 0.6} walk={f / 30} face={{smile: 0.7}} />
        <Mom frame={f} x={290} y={1820} scale={0.95} pose="sit" face={{sad: 0.8, smile: -0.4, look: {x: 0, y: 1}}} />
        <Son
          frame={f}
          x={780}
          y={1840}
          scale={0.9}
          pose="sit"
          armR={{to: {x: 10, y: -575}, prop: 'puri', handAngle: -40}}
          face={{smile: 1, squint: 1}}
        />
      </Stage>
    </AbsoluteFill>
  );
};
