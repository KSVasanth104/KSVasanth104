import React from 'react';
import {Composition} from 'remotion';
import {DiwaliMom} from './DiwaliMom';
import {CharacterSheet} from './CharacterSheet';
import {VIDEO} from './theme';
import {SCENES} from './timeline';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="DiwaliMom"
      component={DiwaliMom}
      durationInFrames={VIDEO.durationInFrames}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    {/* Scene 1 on its own, for quick look checks */}
    <Composition
      id="Scene1Preview"
      component={DiwaliMom}
      durationInFrames={SCENES[0].end}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
    {/* Turnaround of both rigs with their expressions */}
    <Composition
      id="CharacterSheet"
      component={CharacterSheet}
      durationInFrames={120}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
  </>
);
