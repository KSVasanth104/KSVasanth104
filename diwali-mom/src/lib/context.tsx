import React, {createContext, useContext} from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {COLD, Palette} from '../theme';

type Mood = {palette: Palette; warmth: number; globalFrame: number};

const MoodCtx = createContext<Mood>({palette: COLD, warmth: 0, globalFrame: 0});

export const MoodProvider: React.FC<Mood & {children: React.ReactNode}> = ({children, ...mood}) => (
  <MoodCtx.Provider value={mood}>{children}</MoodCtx.Provider>
);

/** Current mixed environment palette and warmth (0 = cold, 1 = warm). */
export const useMood = () => useContext(MoodCtx);

const SceneFrameCtx = createContext(0);

/** Frame relative to the scene's own start (negative while it dissolves in). */
export const useSceneFrame = () => useContext(SceneFrameCtx);

const SlotInner: React.FC<{fadeIn: number; children: React.ReactNode}> = ({fadeIn, children}) => {
  const f = useCurrentFrame() - fadeIn;
  const opacity = fadeIn > 0 ? Math.min(1, Math.max(0, (f + fadeIn) / fadeIn)) : 1;
  return (
    <SceneFrameCtx.Provider value={f}>
      <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>
    </SceneFrameCtx.Provider>
  );
};

/**
 * Places a scene on the timeline. The scene starts `fadeIn` frames early and
 * dissolves in over the previous scene; `tail` keeps it alive underneath the
 * next scene's dissolve.
 */
export const SceneSlot: React.FC<{
  name: string;
  start: number;
  end: number;
  fadeIn: number;
  tail: number;
  children: React.ReactNode;
}> = ({name, start, end, fadeIn, tail, children}) => (
  <Sequence name={name} from={start - fadeIn} durationInFrames={end - start + fadeIn + tail}>
    <SlotInner fadeIn={fadeIn}>{children}</SlotInner>
  </Sequence>
);

/** Same idea inside a scene: a sub-shot that dissolves in at `start`. */
export const Shot: React.FC<{
  f: number;
  start: number;
  end: number;
  fadeIn?: number;
  tail?: number;
  children: (localFrame: number) => React.ReactNode;
}> = ({f, start, end, fadeIn = 8, tail = 8, children}) => {
  if (f < start - fadeIn || f >= end + tail) return null;
  const local = f - start;
  const opacity = fadeIn > 0 ? Math.min(1, Math.max(0, (local + fadeIn) / fadeIn)) : 1;
  return <AbsoluteFill style={{opacity}}>{children(local)}</AbsoluteFill>;
};
