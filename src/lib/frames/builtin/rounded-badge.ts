import type { FrameTemplate } from '../types';

const RECT = 'M20,10 H180 A10,10 0 0 1 190,20 V240 A10,10 0 0 1 180,250 H20 A10,10 0 0 1 10,240 V20 A10,10 0 0 1 20,10 Z';

// Top banner + bottom CTA
const topBannerPath = 'M 10,10 H 190 V 40 H 10 Z';

export const roundedBadgeFrame: FrameTemplate = {
  id: 'rounded-badge',
  name: 'Rozet',
  category: 'banded',
  viewBox: '0 0 200 260',
  clipPath: RECT,
  outlinePath: RECT,
  qrZone: { x: 20, y: 50, width: 160, height: 150 },
  ctaBand: {
    position: 'bottom',
    height: 50,
    backgroundColor: '#059669',
    textY: 237,
  },
  decorativeLayers: [
    {
      id: 'top-banner',
      svgPath: topBannerPath,
      defaultFill: '#059669',
      defaultOpacity: 1,
      colorRole: 'primary',
    },
  ],
};
