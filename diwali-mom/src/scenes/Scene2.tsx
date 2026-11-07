// Scene 2 (3-7 s): the spoon lifts slowly, Mom's eyes drift to the empty chair,
// and the camera pushes in on it.
import React from 'react';
import {Mom} from '../characters/Mom';
import {Stage} from '../components/Camera';
import {useMood, useSceneFrame} from '../lib/context';
import {keys, lerp, mixPt} from '../lib/anim';
import {DiningRoom} from '../sets/DiningRoom';
import {
  ELBOW_AT_MOUTH,
  ELBOW_AT_PLATE,
  MOM_AT_TABLE,
  RESTING_ARM,
  SCENE1_CAMERA,
  SPOON_ANGLE,
  SPOON_AT_MOUTH,
  SPOON_AT_PLATE,
} from './Scene1';

const PUSHED_IN = {zoom: 1.9, x: 722, y: 1075};

export const Scene2: React.FC = () => {
  const f = useSceneFrame();
  const {palette: p, globalFrame} = useMood();

  // the spoon rises slowly... and stops halfway; she doesn't eat
  const t = keys(f, [6, 66, 92, 120], [0, 0.58, 0.58, 0.38]);
  const hand = mixPt(SPOON_AT_PLATE, SPOON_AT_MOUTH, t);
  const gaze = keys(f, [34, 62], [0, 1]);
  const tears = keys(f, [70, 104], [0, 0.8]);

  const c = keys(f, [0, 120], [0, 1]);
  const camera = {
    zoom: lerp(SCENE1_CAMERA.end.zoom, PUSHED_IN.zoom, c),
    x: lerp(SCENE1_CAMERA.end.x, PUSHED_IN.x, c),
    y: lerp(SCENE1_CAMERA.end.y, PUSHED_IN.y, c),
  };

  return (
    <Stage camera={camera}>
      <DiningRoom
        p={p}
        frame={f + 90}
        clockFrame={globalFrame}
        festive={0}
        id="s2"
        overTable={
          <>
            <Mom
              layer="arms"
              frame={f + 90}
              {...MOM_AT_TABLE}
              pose="sit"
              seed={1}
              headTilt={-3 + gaze * 6}
              headTurn={gaze * 0.38}
              armL={{
                to: hand,
                elbow: mixPt(ELBOW_AT_PLATE, ELBOW_AT_MOUTH, t),
                handAngle: lerp(SPOON_ANGLE.plate, SPOON_ANGLE.mouth, t),
                prop: 'spoon',
              }}
              armR={RESTING_ARM}
              face={{
                look: {x: gaze * 0.95, y: 0.9 - gaze * 0.9},
                sad: 0.55 + gaze * 0.35,
                smile: -0.25 - gaze * 0.15,
                eyeOpen: 0.82 + gaze * 0.1,
                tears,
              }}
            />
          </>
        }
      >
        <Mom
          frame={f + 90}
          {...MOM_AT_TABLE}
          pose="sit"
          seed={1}
          headTilt={-3 + gaze * 6}
          headTurn={gaze * 0.38}
          armL={{
            to: hand,
            elbow: mixPt(ELBOW_AT_PLATE, ELBOW_AT_MOUTH, t),
            handAngle: lerp(SPOON_ANGLE.plate, SPOON_ANGLE.mouth, t),
            prop: 'spoon',
          }}
          armR={RESTING_ARM}
          face={{
            look: {x: gaze * 0.95, y: 0.9 - gaze * 0.9},
            sad: 0.55 + gaze * 0.35,
            smile: -0.25 - gaze * 0.15,
            eyeOpen: 0.82 + gaze * 0.1,
            tears,
          }}
        />
      </DiningRoom>
    </Stage>
  );
};
