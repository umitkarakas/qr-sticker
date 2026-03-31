import type { StickerShape } from '../types';

export const likeShape: StickerShape = {
  id: 'like',
  name: 'Begeni',
  category: 'figurative',
  viewBox: '0 0 200 230',
  clipPath:
    'M 80 190 H 30 V 90 H 80 V 190 Z M 80 90 L 90 20 C 90 10 100 5 110 10 C 115 13 118 20 115 30 L 105 70 H 170 C 182 70 190 82 186 94 L 162 170 C 158 182 148 190 136 190 H 80 V 90 Z',
  outlinePath:
    'M 80 190 H 30 V 90 H 80 V 190 Z M 80 90 L 90 20 C 90 10 100 5 110 10 C 115 13 118 20 115 30 L 105 70 H 170 C 182 70 190 82 186 94 L 162 170 C 158 182 148 190 136 190 H 80 V 90 Z',
  qrArea: { x: 50, y: 55, width: 100, height: 100 },
  ctaArea: { x: 100, y: 215, width: 140, anchor: 'middle' },
};
