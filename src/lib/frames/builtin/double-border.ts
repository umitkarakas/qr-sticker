import type { FrameTemplate } from '../types';

const OUTER = 'M20,10 H180 A10,10 0 0 1 190,20 V240 A10,10 0 0 1 180,250 H20 A10,10 0 0 1 10,240 V20 A10,10 0 0 1 20,10 Z';
// Inner border path (8px inset)
const INNER_STROKE = '<rect x="18" y="18" width="164" height="184" rx="6" fill="none" stroke="#334155" stroke-width="1.5" stroke-dasharray="4 3"/>';

export const doubleBorderFrame: FrameTemplate = {
  id: 'double-border',
  name: 'Çift Çerçeve',
  category: 'decorative',
  viewBox: '0 0 200 260',
  clipPath: OUTER,
  outlinePath: OUTER,
  qrZone: { x: 25, y: 25, width: 150, height: 150 },
  ctaBand: {
    position: 'bottom',
    height: 50,
    backgroundColor: '#1e293b',
    textY: 235,
  },
  decorativeLayers: [
    {
      id: 'inner-dashed',
      svgPath: INNER_STROKE,
      defaultFill: 'none',
      defaultOpacity: 1,
      colorRole: 'secondary',
    },
  ],
};
