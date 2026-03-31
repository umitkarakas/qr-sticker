import type { StickerShape } from '../types';

export const starShape: StickerShape = {
  id: 'star',
  name: 'Yildiz',
  category: 'figurative',
  viewBox: '0 0 200 230',
  clipPath:
    'M 100 5 L 123 72 L 195 72 L 136 115 L 158 182 L 100 145 L 42 182 L 64 115 L 5 72 L 77 72 Z',
  outlinePath:
    'M 100 5 L 123 72 L 195 72 L 136 115 L 158 182 L 100 145 L 42 182 L 64 115 L 5 72 L 77 72 Z',
  qrArea: { x: 50, y: 55, width: 100, height: 100 },
  ctaArea: { x: 100, y: 215, width: 140, anchor: 'middle' },
};
