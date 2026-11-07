import React from 'react';
import {AbsoluteFill} from 'remotion';
import {VIDEO} from '../theme';

export type CameraState = {zoom: number; x: number; y: number; rotate?: number};

/** Full-frame SVG canvas with a virtual camera: (x, y) is the world point at frame centre. */
export const Stage: React.FC<{camera?: CameraState; children: React.ReactNode; background?: string}> = ({
  camera = {zoom: 1, x: VIDEO.width / 2, y: VIDEO.height / 2},
  children,
  background,
}) => (
  <AbsoluteFill style={{background}}>
    <svg viewBox={`0 0 ${VIDEO.width} ${VIDEO.height}`} width={VIDEO.width} height={VIDEO.height}>
      <g
        transform={`translate(${VIDEO.width / 2} ${VIDEO.height / 2}) rotate(${camera.rotate ?? 0}) scale(${camera.zoom}) translate(${-camera.x} ${-camera.y})`}
      >
        {children}
      </g>
    </svg>
  </AbsoluteFill>
);

/** Linear blend of two camera states (t already eased by the caller). */
export const mixCamera = (a: CameraState, b: CameraState, t: number): CameraState => ({
  zoom: a.zoom + (b.zoom - a.zoom) * t,
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
  rotate: (a.rotate ?? 0) + ((b.rotate ?? 0) - (a.rotate ?? 0)) * t,
});
