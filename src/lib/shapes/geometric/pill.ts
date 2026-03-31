import type { StickerShape } from '../types';

export const pillShape: StickerShape = {
  id: 'pill',
  name: 'Hap',
  category: 'geometric',
  viewBox: '0 0 200 260',
  clipPath:
    'M 100 10 A 70 70 0 0 1 170 80 V 180 A 70 70 0 0 1 30 180 V 80 A 70 70 0 0 1 100 10 Z',
  outlinePath:
    'M 100 10 A 70 70 0 0 1 170 80 V 180 A 70 70 0 0 1 30 180 V 80 A 70 70 0 0 1 100 10 Z',
  qrArea: { x: 40, y: 50, width: 120, height: 120 },
  ctaArea: { x: 100, y: 220, width: 120, anchor: 'middle' },
};
