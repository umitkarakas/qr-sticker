import type { StickerShape } from '../types';

export const roundedRectShape: StickerShape = {
  id: 'rounded-rect',
  name: 'Yuvarlatilmis Dikdortgen',
  category: 'geometric',
  viewBox: '0 0 200 240',
  clipPath:
    'M 30 10 H 170 A 20 20 0 0 1 190 30 V 170 A 20 20 0 0 1 170 190 H 30 A 20 20 0 0 1 10 170 V 30 A 20 20 0 0 1 30 10 Z',
  outlinePath:
    'M 30 10 H 170 A 20 20 0 0 1 190 30 V 170 A 20 20 0 0 1 170 190 H 30 A 20 20 0 0 1 10 170 V 30 A 20 20 0 0 1 30 10 Z',
  qrArea: { x: 30, y: 25, width: 140, height: 140 },
  ctaArea: { x: 100, y: 210, width: 160, anchor: 'middle' },
};
