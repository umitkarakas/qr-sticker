import type { FrameTemplate } from '../types';

const ROUNDED_RECT = 'M20,10 H180 A10,10 0 0 1 190,20 V240 A10,10 0 0 1 180,250 H20 A10,10 0 0 1 10,240 V20 A10,10 0 0 1 20,10 Z';

// Each circle at (cx,cy) r=4 encoded as SVG arc path
// M cx-r,cy a r,r 0 1,0 2r,0 a r,r 0 1,0 -2r,0 Z
const cornerDotsPath = [
  // Top-left: (28,28), (36,28), (28,36)
  'M 24,28 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0 Z',
  'M 32,28 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0 Z',
  'M 24,36 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0 Z',
  // Top-right: (172,28), (164,28), (172,36)
  'M 168,28 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0 Z',
  'M 160,28 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0 Z',
  'M 168,36 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0 Z',
  // Bottom-left: (28,162), (36,162), (28,154)
  'M 24,162 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0 Z',
  'M 32,162 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0 Z',
  'M 24,154 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0 Z',
  // Bottom-right: (172,162), (164,162), (172,154)
  'M 168,162 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0 Z',
  'M 160,162 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0 Z',
  'M 168,154 a 4,4 0 1,0 8,0 a 4,4 0 1,0 -8,0 Z',
].join(' ');

export const cornerDotsFrame: FrameTemplate = {
  id: 'corner-dots',
  name: 'Köşe Noktaları',
  category: 'decorative',
  viewBox: '0 0 200 260',
  clipPath: ROUNDED_RECT,
  outlinePath: ROUNDED_RECT,
  qrZone: { x: 20, y: 20, width: 160, height: 160 },
  ctaBand: {
    position: 'bottom',
    height: 50,
    backgroundColor: '#1a1a1a',
    textY: 235,
  },
  decorativeLayers: [
    {
      id: 'corner-dots-layer',
      svgPath: cornerDotsPath,
      defaultFill: '#6366f1',
      defaultOpacity: 1,
      colorRole: 'primary',
    },
  ],
};
