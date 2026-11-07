// Scene 3 (7-11 s): Mom lies in bed staring at the ceiling; the phone lies silent.
// Seen from the ceiling, so her stare meets the camera. Slow push-in.
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
  const {palette: p} = useMood();
  const frame = f + 210;

  const c = keys(f, [-15, 120], [0, 1]);
  const camera = {zoom: lerp(1.02, 1.42, c), x: lerp(600, 600, c), y: lerp(980, 650, c)};

  // she glances at the silent phone, then back to the ceiling
  const glance = keys(f, [38, 52, 78, 94], [0, 1, 1, 0]);

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
            face={{look: {x: -glance, y: -glance * 0.4}, sad: 0.65, smile: -0.2, eyeOpen: 0.9}}
          />
        }
      />
    </Stage>
  );
};
