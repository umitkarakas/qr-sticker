import type { StickerShape } from '../types';

export const heartShape: StickerShape = {
  id: 'heart',
  name: 'Kalp',
  category: 'figurative',
  viewBox: '0 0 200 220',
  clipPath:
    'M 100 180 C 40 140 5 100 5 65 C 5 35 25 10 55 10 C 75 10 90 22 100 40 C 110 22 125 10 145 10 C 175 10 195 35 195 65 C 195 100 160 140 100 180 Z',
  outlinePath:
    'M 100 180 C 40 140 5 100 5 65 C 5 35 25 10 55 10 C 75 10 90 22 100 40 C 110 22 125 10 145 10 C 175 10 195 35 195 65 C 195 100 160 140 100 180 Z',
  qrArea: { x: 40, y: 40, width: 120, height: 100 },
  ctaArea: { x: 100, y: 200, width: 160, anchor: 'middle' },
};
