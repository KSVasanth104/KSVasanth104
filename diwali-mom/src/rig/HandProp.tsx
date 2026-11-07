import React from 'react';
import {FESTIVE} from '../theme';

export type HandPropName = 'none' | 'spoon' | 'ladle' | 'puri' | 'laddoo';

/** Objects a hand can hold. Drawn in hand space: +y points out of the fist. */
export const HandProp: React.FC<{name: HandPropName; r: number; side: 1 | -1}> = ({name, r}) => {
  switch (name) {
    case 'spoon':
      return (
        <g className="prop-spoon">
          <rect x={-3} y={-r * 0.6} width={6} height={r * 3.4} rx={3} fill="#c9cfd8" />
          <ellipse cx={0} cy={r * 3.2} rx={r * 0.65} ry={r * 0.95} fill="#d7dce4" />
          <ellipse cx={0} cy={r * 3.35} rx={r * 0.45} ry={r * 0.62} fill="#f6f2e8" />
        </g>
      );
    case 'ladle':
      return (
        <g className="prop-ladle">
          <rect x={-3.5} y={-r * 2.2} width={7} height={r * 6.4} rx={3.5} fill="#c4cad3" />
          <ellipse cx={0} cy={r * 4.3} rx={r * 1.05} ry={r * 0.8} fill="#aeb5c0" />
        </g>
      );
    case 'puri':
      return (
        <g className="prop-puri">
          <ellipse cx={0} cy={r * 1.4} rx={r * 1.25} ry={r * 1.05} fill={FESTIVE.puri} />
          <ellipse cx={-r * 0.25} cy={r * 1.2} rx={r * 0.6} ry={r * 0.45} fill="#f3cd8a" />
        </g>
      );
    case 'laddoo':
      return (
        <g className="prop-laddoo">
          <circle cx={0} cy={r * 1.5} r={r * 0.95} fill={FESTIVE.laddoo} />
          <circle cx={-r * 0.3} cy={r * 1.2} r={r * 0.3} fill="#f8c66a" />
        </g>
      );
    default:
      return null;
  }
};
