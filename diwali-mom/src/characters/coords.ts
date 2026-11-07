import type {Pt} from '../rig/Arm';

/**
 * Convert a world-space point (frame pixels at camera zoom 1) into a character's
 * standing coordinates, so a hand can be aimed at a plate, a pillow, a door handle...
 * `drop` is the seat offset of the pose (Mom: sit 110, kneel 190; Son: sit 130).
 */
export const worldToChar = (world: Pt, char: {x: number; y: number; scale: number; drop?: number; flip?: boolean}): Pt => ({
  x: ((world.x - char.x) / char.scale) * (char.flip ? -1 : 1),
  y: (world.y - char.y) / char.scale - (char.drop ?? 0),
});
