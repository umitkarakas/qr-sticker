import type { StickerShape } from '../types';

export const squareShape: StickerShape = {
  id: 'square',
  name: 'Kare',
  category: 'geometric',
  viewBox: '0 0 200 240',
  clipPath: 'M 10 10 H 190 V 190 H 10 Z',
  outlinePath: 'M 10 10 H 190 V 190 H 10 Z',
  qrArea: { x: 30, y: 25, width: 140, height: 140 },
  ctaArea: { x: 100, y: 210, width: 160, anchor: 'middle' },
};
