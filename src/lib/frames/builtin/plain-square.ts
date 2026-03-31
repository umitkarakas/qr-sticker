import type { FrameTemplate } from '../types';

export const plainSquareFrame: FrameTemplate = {
  id: 'plain-square',
  name: 'Sade Kare',
  category: 'plain',
  viewBox: '0 0 200 260',
  clipPath: 'M20,10 H180 A10,10 0 0 1 190,20 V240 A10,10 0 0 1 180,250 H20 A10,10 0 0 1 10,240 V20 A10,10 0 0 1 20,10 Z',
  outlinePath: 'M20,10 H180 A10,10 0 0 1 190,20 V240 A10,10 0 0 1 180,250 H20 A10,10 0 0 1 10,240 V20 A10,10 0 0 1 20,10 Z',
  qrZone: { x: 20, y: 20, width: 160, height: 160 },
  ctaBand: {
    position: 'bottom',
    height: 50,
    backgroundColor: '#1a1a1a',
    textY: 235,
  },
  decorativeLayers: [],
};
