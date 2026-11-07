// Scene 3 (7-10 s): Mom lies in bed staring at the ceiling; the phone lies silent.
// Seen from the ceiling, so her stare meets the camera. The camera pushes in on her
// face as her eyes drift and glisten, leading into the memory (SceneMemory).
import React from 'react';
import {Mom} from '../characters/Mom';
import {Stage} from '../components/Camera';
import {useMood, useSceneFrame} from '../lib/context';
import {breath, keys, lerp} from '../lib/anim';
import {BedroomTopDown, TOPDOWN} from '../sets/BedroomTopDown';

/** Mom lying in the bed, head on the pillow (top-down). */
export const MOM_IN_BED = {x: TOPDOWN.pillow.x, y: TOPDOWN.pillow.y + 30 + 505 * 1.45, scale: 1.45};

export const Scene3: React.FC = () => {
  const f = useSceneFrame();
  const {palette: p, globalFrame: frame} = useMood();

  const c = keys(f, [-15, 100], [0, 1]);
  const camera = {zoom: lerp(1.02, 1.75, c), x: lerp(600, 735, c), y: lerp(980, 610, c)};

  // she glances at the silent phone, then back up... and drifts into a memory
  const glance = keys(f, [22, 34, 52, 64], [0, 1, 1, 0]);
  const drift = keys(f, [64, 92], [0, 1]);

  return (
    <Stage camera={camera}>
      <BedroomTopDown
        p={p}
        frame={frame}
        showMat={false}
        showPhone
        diya={0}
        moonlight={1}
        breathBed={breath(frame, 1)}
        id="s3"
        bedOccupant={
          <Mom
            frame={frame}
            {...MOM_IN_BED}
            pose="lie"
            seed={4}
            breathe={0.6}
            headTurn={-glance * 0.35}
            headTilt={glance * 6}
            face={{
              look: {x: -glance + drift * 0.3, y: -glance * 0.4 - drift * 0.5},
              sad: 0.65 + drift * 0.25,
              smile: -0.2 + drift * 0.15,
              eyeOpen: 0.9 - drift * 0.1,
              tears: drift,
              sparkle: drift * 0.5,
            }}
          />
        }
      />
    </Stage>
  );
};
