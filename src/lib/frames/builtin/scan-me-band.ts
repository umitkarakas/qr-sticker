import type { FrameTemplate } from '../types';

const ROUNDED_RECT = 'M20,10 H180 A10,10 0 0 1 190,20 V240 A10,10 0 0 1 180,250 H20 A10,10 0 0 1 10,240 V20 A10,10 0 0 1 20,10 Z';

// Two horizontal bars at top suggesting scanner aesthetic
// Rect 1: y=12 height=3 full width (x=10 to x=190)
// Rect 2: y=17 height=1.5 full width
const scanLinesPath = [
  'M 10,12 H 190 V 15 H 10 Z',
  'M 10,17 H 190 V 18.5 H 10 Z',
].join(' ');

export const scanMeBandFrame: FrameTemplate = {
  id: 'scan-me-band',
  name: 'Tara Beni',
  category: 'banded',
  viewBox: '0 0 200 260',
  clipPath: ROUNDED_RECT,
  outlinePath: ROUNDED_RECT,
  qrZone: { x: 20, y: 30, width: 160, height: 150 },
  ctaBand: {
    position: 'bottom',
    height: 60,
    backgroundColor: '#6366f1',
    textY: 235,
  },
  decorativeLayers: [
    {
      id: 'scan-lines-layer',
      svgPath: scanLinesPath,
      defaultFill: '#6366f1',
      defaultOpacity: 0.6,
      colorRole: 'accent',
    },
  ],
};
