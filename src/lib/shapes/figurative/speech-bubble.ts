import type { StickerShape } from '../types';

export const speechBubbleShape: StickerShape = {
  id: 'speech-bubble',
  name: 'Konusma Balonu',
  category: 'figurative',
  viewBox: '0 0 200 230',
  clipPath:
    'M 30 10 H 170 A 20 20 0 0 1 190 30 V 150 A 20 20 0 0 1 170 170 H 120 L 100 195 L 80 170 H 30 A 20 20 0 0 1 10 150 V 30 A 20 20 0 0 1 30 10 Z',
  outlinePath:
    'M 30 10 H 170 A 20 20 0 0 1 190 30 V 150 A 20 20 0 0 1 170 170 H 120 L 100 195 L 80 170 H 30 A 20 20 0 0 1 10 150 V 30 A 20 20 0 0 1 30 10 Z',
  qrArea: { x: 30, y: 20, width: 140, height: 120 },
  ctaArea: { x: 100, y: 155, width: 140, anchor: 'middle' },
};
