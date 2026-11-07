// Scene 6 (21-26 s): same table as scene 1, now full. The son takes a bite and smiles;
// Mom watches him with her hands clasped.
import React from 'react';
import {Mom} from '../characters/Mom';
import {Son, SON_SHOULDER_R} from '../characters/Son';
import {worldToChar} from '../characters/coords';
import {Stage} from '../components/Camera';
import {useMood, useSceneFrame} from '../lib/context';
import {keys, lerp, mixPt, wave} from '../lib/anim';
import {solveArm} from '../rig/Arm';
import {DINING, DiningRoom} from '../sets/DiningRoom';
import {MOM_AT_TABLE} from './Scene1';

const SON_AT_TABLE = {x: DINING.sonX, y: DINING.seatFloorY, scale: 1.48, drop: 130};
const FEAST_DONE = [1, 1, 1, 1, 1, 1, 1, 1];

export const Scene6: React.FC = () => {
  const f = useSceneFrame();
  const {palette: p, globalFrame} = useMood();
  const frame = f + 630;

  // son: lift the puri, bite, chew, beam, then look at Mom
  const lift = keys(f, [8, 30, 44, 64], [0, 1, 1, 0]);
  const bite = keys(f, [26, 32, 40], [0, 0.55, 0]);
  const chew = f > 40 && f < 74 ? Math.max(0, Math.sin((f - 40) / 3)) * 0.14 : 0;
  const beam = keys(f, [66, 84], [0, 1]);
  const toMom = keys(f, [96, 116], [0, 1]);

  const plate = worldToChar({x: 708, y: 1210}, SON_AT_TABLE);
  const plateElbow = {x: -112, y: -380};
  const mouthHand = {x: -24, y: -536};
  const mouthElbow = {x: -96, y: -420};
  const sonRest = worldToChar({x: 800, y: 1232}, SON_AT_TABLE);

  // mom: hands clasped under her chin, watching him eat
  const clasp = keys(f, [-12, 14], [0.4, 1]);

  const c = keys(f, [-12, 150], [0, 1]);
  const camera = {zoom: lerp(1.15, 1.3, c), x: lerp(545, 560, c), y: lerp(1030, 1010, c)};

  return (
    <Stage camera={camera}>
      <DiningRoom
        p={p}
        frame={frame}
        clockFrame={globalFrame}
        festive={1}
        feast={FEAST_DONE}
        id="s6"
        overTable={
          <>
            <Mom
              layer="arms"
              frame={frame}
              {...MOM_AT_TABLE}
              pose="sit"
              seed={1}
              headTurn={0.5}
              headTilt={7 + wave(frame, 70) * 1.5}
              armL={{to: {x: -7, y: lerp(-340, -447, clasp)}, elbow: {x: -82, y: lerp(-320, -348, clasp)}}}
              armR={{to: {x: 7, y: lerp(-340, -447, clasp)}, elbow: {x: 82, y: lerp(-320, -348, clasp)}}}
              face={{
                look: {x: 1, y: 0.1},
                smile: 0.75 + beam * 0.25,
                sparkle: 0.8,
                squint: 0.25 + beam * 0.3,
                tears: 0.45,
                brow: 0.3,
              }}
            />
            <Son
              layer="arms"
              frame={frame}
              {...SON_AT_TABLE}
              pose="sit"
              seed={3}
              backpack={false}
              headTurn={lerp(0, -0.5, toMom)}
              headTilt={beam * (1 - toMom) * 6 - toMom * 5}
              headBob={beam * Math.max(0, wave(f, 18)) * -3 * (1 - toMom)}
              armL={{
                to: mixPt(plate, mouthHand, lift),
                elbow: mixPt(plateElbow, mouthElbow, lift),
                prop: 'puri',
                handAngle: lerp(70, -30, lift),
              }}
              armR={{to: sonRest, elbow: solveArm(SON_SHOULDER_R, sonRest, 116, 106, -1).elbow}}
              face={{
                look: {x: lerp(0, -1, toMom), y: lerp(0.6 * (1 - lift), 0, beam)},
                smile: lerp(0.3, 1, beam),
                open: bite + chew,
                squint: beam * (1 - toMom * 0.5),
                eyeOpen: lerp(1, 0.55, beam * (1 - toMom)),
                sparkle: toMom * 0.7,
              }}
            />
          </>
        }
      >
        <Mom
          frame={frame}
          {...MOM_AT_TABLE}
          pose="sit"
          seed={1}
          headTurn={0.5}
          headTilt={7 + wave(frame, 70) * 1.5}
          armL={{to: {x: -7, y: lerp(-340, -447, clasp)}, elbow: {x: -82, y: lerp(-320, -348, clasp)}}}
          armR={{to: {x: 7, y: lerp(-340, -447, clasp)}, elbow: {x: 82, y: lerp(-320, -348, clasp)}}}
          face={{
            look: {x: 1, y: 0.1},
            smile: 0.75 + beam * 0.25,
            sparkle: 0.8,
            squint: 0.25 + beam * 0.3,
            tears: 0.45,
            brow: 0.3,
          }}
        />
        <Son
          frame={frame}
          {...SON_AT_TABLE}
          pose="sit"
          seed={3}
          backpack={false}
          headTurn={lerp(0, -0.5, toMom)}
          headTilt={beam * (1 - toMom) * 6 - toMom * 5}
          headBob={beam * Math.max(0, wave(f, 18)) * -3 * (1 - toMom)}
          armL={{
            to: mixPt(plate, mouthHand, lift),
            elbow: mixPt(plateElbow, mouthElbow, lift),
            prop: 'puri',
            handAngle: lerp(70, -30, lift),
          }}
          armR={{to: sonRest, elbow: solveArm(SON_SHOULDER_R, sonRest, 116, 106, -1).elbow}}
          face={{
            look: {x: lerp(0, -1, toMom), y: lerp(0.6 * (1 - lift), 0, beam)},
            smile: lerp(0.3, 1, beam),
            open: bite + chew,
            squint: beam * (1 - toMom * 0.5),
            eyeOpen: lerp(1, 0.55, beam * (1 - toMom)),
            sparkle: toMom * 0.7,
          }}
        />
      </DiningRoom>
    </Stage>
  );
};
