import type { FrameTemplate } from '../types';

// Stadium / landscape pill shape
// viewBox: 0 0 300 200 — r=90 gives perfect semicircle caps
// M 90,10 → line to 210,10 → right semicircle down to 210,190 → line to 90,190 → left semicircle up to 90,10
const STADIUM =
  'M 90,10 H 210 A 90,90 0 0 1 210,190 H 90 A 90,90 0 0 1 90,10 Z';

export const pillBandFrame: FrameTemplate = {
  id: 'pill-band',
  name: 'Stadium',
  category: 'banded',
  viewBox: '0 0 300 200',
  clipPath: STADIUM,
  outlinePath: STADIUM,
  qrZone: { x: 100, y: 20, width: 100, height: 120 },
  ctaBand: {
    position: 'bottom',
    height: 42,
    backgroundColor: '#0f172a',
    textY: 181,
  },
  decorativeLayers: [],
};
