// Scene 8 (32-38 s): slow pull-back from Mom smiling on the floor to reveal her son
// asleep in her bed. She glances up at him. Fade to black, end card.
import React from 'react';
import {Mom} from '../characters/Mom';
import {Son} from '../characters/Son';
import {CameraState, Stage} from '../components/Camera';
import {useMood, useSceneFrame} from '../lib/context';
import {breath, keys, lerp} from '../lib/anim';
import {BedroomTopDown, TOPDOWN} from '../sets/BedroomTopDown';
import {Palette} from '../theme';

const MOM_ON_MAT = {x: TOPDOWN.matPillow.x, y: TOPDOWN.matPillow.y + 26 + 511 * 1.25, scale: 1.25};
const SON_IN_BED = {x: TOPDOWN.pillow.x, y: TOPDOWN.pillow.y + 20 + 616 * 1.4, scale: 1.4};

export const TOPDOWN_CLOSE: CameraState = {zoom: 1.75, x: 262, y: 880};
const TOPDOWN_WIDE: CameraState = {zoom: 1.0, x: 560, y: 1000};

/** The shared top-down night shot used by the end of scene 7 and all of scene 8. */
export const TopDownNight: React.FC<{
  frame: number;
  p: Palette;
  camera: CameraState;
  /** 0 = eyes closed, 1 = glancing up at the son. */
  momLook: number;
  momEyes: number;
  breathe: number;
}> = ({frame, p, camera, momLook, momEyes, breathe}) => (
  <Stage camera={camera}>
    <BedroomTopDown
      p={p}
      frame={frame}
      showMat
      showPhone
      diya={1}
      moonlight={0}
      breathBed={breath(frame, 3)}
      breathMat={breathe}
      id="s8"
      bedOccupant={
        <Son
          frame={frame}
          {...SON_IN_BED}
          pose="lie"
          seed={9}
          backpack={false}
          headTilt={-6}
          face={{eyeOpen: 0, closedStyle: 'sleep', smile: 0.3, noBlink: true}}
        />
      }
      matOccupant={
        <Mom
          frame={frame}
          {...MOM_ON_MAT}
          pose="lie"
          seed={10}
          headTurn={momLook * 0.45}
          headTilt={momLook * 12}
          face={{
            eyeOpen: momEyes,
            noBlink: momEyes < 0.5,
            closedStyle: 'happy',
            smile: 0.85,
            look: {x: momLook, y: -momLook * 0.5},
            sparkle: momLook * 0.7,
            squint: 0.25,
          }}
        />
      }
    />
  </Stage>
);

export const Scene8: React.FC = () => {
  const f = useSceneFrame();
  const {palette: p, globalFrame} = useMood();
  const frame = globalFrame;

  const c = keys(f, [0, 125], [0, 1]);
  const camera: CameraState = {
    zoom: lerp(TOPDOWN_CLOSE.zoom, TOPDOWN_WIDE.zoom, c),
    x: lerp(TOPDOWN_CLOSE.x, TOPDOWN_WIDE.x, c),
    y: lerp(TOPDOWN_CLOSE.y, TOPDOWN_WIDE.y, c),
  };
  const eyes = keys(f, [36, 46, 96, 108], [0, 1, 1, 0]);
  const look = keys(f, [44, 60, 92, 104], [0, 1, 1, 0.2]);

  return <TopDownNight frame={frame} p={p} camera={camera} momLook={look} momEyes={eyes} breathe={breath(frame, 2)} />;
};
