// Scene 3c - Tears (15-17 s): back in the dark bedroom, close on Mom's face.
// A tear rolls down as the memory fades; she closes her eyes... and the doorbell
// rings. Her eyes snap open: who would come at this hour? (This motivates scene 4.)
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
  const close = keys(f, [24, 36, 45, 50], [1, 0.05, 0.05, 1.15]);
  const startle = keys(f, [44, 50], [0, 1]);
  const sob = Math.max(0, Math.sin(f * 0.5)) * keys(f, [10, 28, 44, 46], [0, 1, 0.4, 0]);

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
            headTilt={-3 - startle * 4}
            headTurn={-startle * 0.3}
            headBob={sob * 1.5 - startle * 4}
            face={{
              look: {x: lerp(0.2, -0.9, startle), y: -0.3},
              sad: lerp(1, 0.45, startle),
              brow: startle * 0.9,
              smile: lerp(-0.45, -0.1, startle),
              open: sob * 0.12 + startle * 0.12,
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
