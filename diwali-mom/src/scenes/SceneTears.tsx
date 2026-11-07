// Scene 3c - Tears (15-17 s): back in the dark bedroom, close on Mom's face.
// A tear rolls down as the memory fades; she closes her eyes. Then the doorbell.
import React from 'react';
import {Mom} from '../characters/Mom';
import {Stage} from '../components/Camera';
import {useMood, useSceneFrame} from '../lib/context';
import {breath, keys, lerp} from '../lib/anim';
import {BedroomTopDown} from '../sets/BedroomTopDown';
import {MOM_IN_BED} from './Scene3';

export const SceneTears: React.FC = () => {
  const f = useSceneFrame();
  const {palette: p, globalFrame: frame} = useMood();
  const c = keys(f, [-15, 60], [0, 1]);
  const camera = {zoom: lerp(2.05, 2.25, c), x: 742, y: lerp(600, 592, c)};
  const close = keys(f, [34, 50], [1, 0.05]);
  const sob = Math.max(0, Math.sin(f * 0.5)) * keys(f, [10, 30, 50], [0, 1, 0.3]);

  return (
    <Stage camera={camera}>
      <BedroomTopDown
        p={p}
        frame={frame}
        showMat={false}
        showPhone
        diya={0}
        moonlight={1}
        breathBed={breath(frame, 1, 1.6)}
        id="s3c"
        bedOccupant={
          <Mom
            frame={frame}
            {...MOM_IN_BED}
            pose="lie"
            seed={4}
            breathe={1.4}
            headTilt={-3}
            headBob={sob * 1.5}
            face={{
              look: {x: 0.2, y: -0.3},
              sad: 1,
              smile: -0.45,
              open: sob * 0.12,
              eyeOpen: 0.78 * close,
              closedStyle: 'sleep',
              noBlink: true,
              tears: close > 0.5 ? 1 : 0,
              tearDrop: keys(f, [-12, 40, 60], [0, 1, 1.2]),
              tearDrop2: keys(f, [10, 56], [0, 1]),
            }}
          />
        }
      />
    </Stage>
  );
};
