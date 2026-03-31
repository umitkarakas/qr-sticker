import type { StickerShape } from '../types';

export const hexagonShape: StickerShape = {
  id: 'hexagon',
  name: 'Altıgen',
  category: 'figurative',
  viewBox: '0 0 200 230',
  clipPath:
    'M 100 10 L 187 57 L 187 153 L 100 200 L 13 153 L 13 57 Z',
  outlinePath:
    'M 100 10 L 187 57 L 187 153 L 100 200 L 13 153 L 13 57 Z',
  qrArea: { x: 42, y: 45, width: 116, height: 116 },
  ctaArea: { x: 100, y: 215, width: 140, anchor: 'middle' },
};
