import type { FrameTemplate } from '../types';

const ROUNDED_RECT = 'M20,10 H180 A10,10 0 0 1 190,20 V240 A10,10 0 0 1 180,250 H20 A10,10 0 0 1 10,240 V20 A10,10 0 0 1 20,10 Z';

const bracketsContent = [
  '<path d="M 20,45 L 20,20 L 45,20" fill="none" stroke="#333333" stroke-width="3" stroke-linecap="round"/>',
  '<path d="M 155,20 L 180,20 L 180,45" fill="none" stroke="#333333" stroke-width="3" stroke-linecap="round"/>',
  '<path d="M 20,155 L 20,180 L 45,180" fill="none" stroke="#333333" stroke-width="3" stroke-linecap="round"/>',
  '<path d="M 155,180 L 180,180 L 180,155" fill="none" stroke="#333333" stroke-width="3" stroke-linecap="round"/>',
].join('');

export const cornerBracketsFrame: FrameTemplate = {
  id: 'corner-brackets',
  name: 'Köşe Parantezleri',
  category: 'decorative',
  viewBox: '0 0 200 260',
  clipPath: ROUNDED_RECT,
  outlinePath: ROUNDED_RECT,
  qrZone: { x: 25, y: 25, width: 150, height: 150 },
  ctaBand: {
    position: 'bottom',
    height: 50,
    backgroundColor: '#1a1a1a',
    textY: 235,
  },
  decorativeLayers: [
    {
      id: 'corner-brackets-layer',
      svgPath: bracketsContent,
      defaultFill: 'none',
      defaultOpacity: 1,
      colorRole: 'primary',
    },
  ],
};
