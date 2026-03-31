import type { FrameTemplate } from '../types';

// Pill/stadium shape — wide rounded rectangle
const PILL = 'M 30,10 H 170 A 30,30 0 0 1 170,130 H 30 A 30,30 0 0 1 30,10 Z';

export const pillBandFrame: FrameTemplate = {
  id: 'pill-band',
  name: 'Hap',
  category: 'banded',
  viewBox: '0 0 200 180',
  clipPath: PILL,
  outlinePath: PILL,
  qrZone: { x: 40, y: 15, width: 120, height: 100 },
  ctaBand: {
    position: 'bottom',
    height: 34,
    backgroundColor: '#0f172a',
    textY: 153,
  },
  decorativeLayers: [],
};
