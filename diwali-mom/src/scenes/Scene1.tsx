// Scene 1 (0-3 s): Mom eats plain rice alone at a small table. Cold, dim light.
import React from 'react';
import {Mom} from '../characters/Mom';
import {worldToChar} from '../characters/coords';
import {Stage} from '../components/Camera';
import {useMood, useSceneFrame} from '../lib/context';
import {keys, lerp, mixPt} from '../lib/anim';
import {DINING, DiningRoom} from '../sets/DiningRoom';

export const MOM_AT_TABLE = {x: DINING.momX, y: DINING.seatFloorY, scale: 1.6, drop: 110};

/** Spoon hand poses in Mom's coordinates. */
export const SPOON_AT_PLATE = {x: -4, y: -338};
export const SPOON_AT_MOUTH = {x: -26, y: -424};
export const ELBOW_AT_PLATE = {x: -92, y: -324};
export const ELBOW_AT_MOUTH = {x: -74, y: -334};
export const SPOON_ANGLE = {plate: 80, mouth: -52};
export const RESTING_ARM = {
  to: worldToChar({x: 425, y: 1228}, MOM_AT_TABLE),
  elbow: worldToChar({x: 528, y: 1212}, MOM_AT_TABLE),
  flatHand: true,
};

export const SCENE1_CAMERA = {
  start: {zoom: 1.1, x: 540, y: 1010},
  end: {zoom: 1.15, x: 525, y: 1025},
};

export const Scene1: React.FC = () => {
  const f = useSceneFrame();
  const {palette: p, globalFrame} = useMood();

  // spoon: scoop → mouth → chew → back to the plate
  const t = keys(f, [0, 12, 30, 40, 58, 90], [0, 0, 1, 1, 0, 0]);
  const scoop = t < 0.05 ? Math.sin(f / 5) * 5 : 0;
  const hand = mixPt(SPOON_AT_PLATE, SPOON_AT_MOUTH, t);
  hand.x += scoop;
  const bite = keys(f, [22, 30, 37], [0, 0.32, 0]);
  const chew = f > 38 && f < 82 ? Math.max(0, Math.sin((f - 38) / 3.1)) * 0.12 : 0;

  const camT = keys(f, [0, 90], [0, 1]);
  const camera = {
    zoom: lerp(SCENE1_CAMERA.start.zoom, SCENE1_CAMERA.end.zoom, camT),
    x: lerp(SCENE1_CAMERA.start.x, SCENE1_CAMERA.end.x, camT),
    y: lerp(SCENE1_CAMERA.start.y, SCENE1_CAMERA.end.y, camT),
  };

  return (
    <Stage camera={camera}>
      <DiningRoom
        p={p}
        frame={f}
        clockFrame={globalFrame}
        festive={0}
        id="s1"
        overTable={
          <>
            <Mom
              layer="arms"
              frame={f}
              {...MOM_AT_TABLE}
              pose="sit"
              seed={1}
              headTilt={-3 + t * 2}
              headBob={2 - t * 3}
              armL={{
                to: hand,
                elbow: mixPt(ELBOW_AT_PLATE, ELBOW_AT_MOUTH, t),
                handAngle: lerp(SPOON_ANGLE.plate, SPOON_ANGLE.mouth, t),
                prop: 'spoon',
              }}
              armR={RESTING_ARM}
              face={{
                look: {x: 0.1, y: 0.9 - t * 0.6},
                sad: 0.55,
                smile: -0.25,
                eyeOpen: 0.82,
                open: bite + chew,
              }}
            />
          </>
        }
      >
        <Mom
          frame={f}
          {...MOM_AT_TABLE}
          pose="sit"
          seed={1}
          headTilt={-3 + t * 2}
          headBob={2 - t * 3}
          armL={{
            to: hand,
            elbow: mixPt(ELBOW_AT_PLATE, ELBOW_AT_MOUTH, t),
            handAngle: lerp(SPOON_ANGLE.plate, SPOON_ANGLE.mouth, t),
            prop: 'spoon',
          }}
          armR={RESTING_ARM}
          face={{
            look: {x: 0.1, y: 0.9 - t * 0.6},
            sad: 0.55,
            smile: -0.25,
            eyeOpen: 0.82,
            open: bite + chew,
          }}
        />
      </DiningRoom>
    </Stage>
  );
};
