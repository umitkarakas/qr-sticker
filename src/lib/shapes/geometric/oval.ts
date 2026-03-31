import type { StickerShape } from '../types';

export const ovalShape: StickerShape = {
  id: 'oval',
  name: 'Oval',
  category: 'geometric',
  viewBox: '0 0 240 220',
  clipPath:
    'M 120 20 A 110 80 0 1 1 120 180 A 110 80 0 1 1 120 20 Z',
  outlinePath:
    'M 120 20 A 110 80 0 1 1 120 180 A 110 80 0 1 1 120 20 Z',
  qrArea: { x: 60, y: 40, width: 120, height: 120 },
  ctaArea: { x: 120, y: 200, width: 180, anchor: 'middle' },
};
