import type { StickerShape } from '../types';

export const circleShape: StickerShape = {
  id: 'circle',
  name: 'Daire',
  category: 'geometric',
  viewBox: '0 0 200 240',
  clipPath: 'M 100 10 A 90 90 0 1 1 100 190 A 90 90 0 1 1 100 10 Z',
  outlinePath: 'M 100 10 A 90 90 0 1 1 100 190 A 90 90 0 1 1 100 10 Z',
  qrArea: { x: 42, y: 42, width: 116, height: 116 },
  ctaArea: { x: 100, y: 210, width: 160, anchor: 'middle' },
};
