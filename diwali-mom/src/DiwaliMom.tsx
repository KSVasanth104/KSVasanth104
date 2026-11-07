import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {FONT_FAMILY, mixPalette, VIDEO} from './theme';
import {BLACKOUT, CAPTIONS, END_CARD, SCENES, WARM_SWITCH} from './timeline';
import {MoodProvider, SceneSlot} from './lib/context';
import {keys} from './lib/anim';
import {Captions} from './components/Captions';
import {Soundtrack} from './components/Soundtrack';
import {EndCard} from './components/EndCard';
import {Dust, GradeOverlay, Grain, Vignette, gradeFilter} from './components/Atmosphere';
import {Scene1} from './scenes/Scene1';
import {Scene2} from './scenes/Scene2';
import {Scene3} from './scenes/Scene3';
import {Scene4} from './scenes/Scene4';
import {Scene5} from './scenes/Scene5';
import {Scene6} from './scenes/Scene6';
import {Scene7} from './scenes/Scene7';
import {Scene8} from './scenes/Scene8';

const SCENE_COMPONENTS: Record<number, React.FC> = {
  1: Scene1,
  2: Scene2,
  3: Scene3,
  4: Scene4,
  5: Scene5,
  6: Scene6,
  7: Scene7,
  8: Scene8,
};

const useFont = () => {
  const [handle] = useState(() => delayRender('Loading caption font'));
  useEffect(() => {
    loadFont({family: FONT_FAMILY, url: staticFile('fonts/Baloo2-ExtraBold.woff2'), weight: '800'})
      .then(() => continueRender(handle))
      .catch((err) => {
        console.error(err);
        continueRender(handle);
      });
  }, [handle]);
};

/** Warmth of the whole film: 0 (cold blue) → 1 (warm gold) when the door opens. */
export const warmthAt = (frame: number) => keys(frame, [WARM_SWITCH.start, WARM_SWITCH.end], [0, 1]);

export const DiwaliMom: React.FC = () => {
  useFont();
  const frame = useCurrentFrame();
  const warmth = warmthAt(frame);
  const palette = mixPalette(warmth);
  const black = keys(frame, [BLACKOUT.start, BLACKOUT.end], [0, 1]);

  return (
    <MoodProvider palette={palette} warmth={warmth} globalFrame={frame}>
      <AbsoluteFill style={{backgroundColor: '#000'}}>
        {/* ----- picture, colour-graded as a whole ----- */}
        <AbsoluteFill style={{filter: gradeFilter(warmth)}}>
          {SCENES.map((s, i) => {
            const Comp = SCENE_COMPONENTS[s.id];
            const next = SCENES[i + 1];
            return (
              <SceneSlot key={s.id} name={s.name} start={s.start} end={s.end} fadeIn={s.fadeIn} tail={next ? next.fadeIn : 0}>
                <Comp />
              </SceneSlot>
            );
          })}
        </AbsoluteFill>
        <GradeOverlay warmth={warmth} />

        {/* ----- atmosphere ----- */}
        <Dust frame={frame} color={palette.dust} opacity={0.75} />
        <Vignette strength={0.62 - warmth * 0.12} />
        <Grain frame={frame} opacity={0.06} />

        {/* ----- end fade, then text on top ----- */}
        <AbsoluteFill style={{backgroundColor: '#000', opacity: black}} />
        {frame >= END_CARD.start && (
          <Sequence name="End card - Happy Diwali" from={END_CARD.start} durationInFrames={END_CARD.end - END_CARD.start}>
            <EndCard f={frame - END_CARD.start} />
          </Sequence>
        )}
        <Captions cues={CAPTIONS} frame={frame} warmth={warmth} />

        {/* ----- Tamil voice-over, South Indian score, SFX (cue sheet: src/audio.ts) ----- */}
        <Soundtrack />
      </AbsoluteFill>
    </MoodProvider>
  );
};

export const FILM_SIZE = VIDEO;
