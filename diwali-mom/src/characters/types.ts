import type {ArmPose} from '../rig/Arm';
import type {FacePose} from '../rig/Face';

export type {ArmPose, FacePose};

/**
 * Shared props for the rigged Mom and Son.
 *
 * Coordinate system: the character is drawn front-facing with the feet at (0, 0)
 * and "up" = negative y. Hand targets (`armL.to`, `armR.to`) are given in this
 * standing coordinate space even when seated: the seat offset is applied for you.
 *
 * `armL` is the arm on the LEFT of the screen, `armR` the arm on the RIGHT.
 */
export type CharacterProps = {
  /** Frame used for automatic blinking and breathing. */
  frame: number;
  x: number;
  y: number;
  scale?: number;
  flip?: boolean;
  seed?: number;
  /** Head roll in degrees (positive = clockwise). */
  headTilt?: number;
  /** Fake 3/4 head turn, -1 (looks screen-left) .. 1 (looks screen-right). */
  headTurn?: number;
  /** Extra vertical head offset (nods, laughing bounce). */
  headBob?: number;
  /** Upper-body lean in degrees, pivoting at the waist. */
  lean?: number;
  /** Breathing amplitude multiplier (0 = still). */
  breathe?: number;
  pose?: 'stand' | 'sit' | 'kneel' | 'lie';
  /** Override how far the upper body drops for the pose (bigger = bowing forward). */
  seatDrop?: number;
  /** Walk-cycle phase in cycles (walking toward camera); undefined = standing. */
  walk?: number;
  armL?: ArmPose;
  armR?: ArmPose;
  face?: FacePose;
  opacity?: number;
  /** Render only the arms (to layer hands over a table top), or everything. */
  layer?: 'all' | 'arms';
};
