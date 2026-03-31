import type { FrameTemplate } from '../types';

const RECT = 'M20,10 H180 A10,10 0 0 1 190,20 V240 A10,10 0 0 1 180,250 H20 A10,10 0 0 1 10,240 V20 A10,10 0 0 1 20,10 Z';

// Dotted border: dots along the perimeter
// 12 dots on each long side (vertical), 8 on each short side (horizontal)
function dot(cx: number, cy: number, r = 3): string {
  return `M ${cx - r},${cy} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 ${-r * 2},0`;
}

const dots: string[] = [];
// Top row: x 20..180 step 20, y=6
for (let x = 20; x <= 180; x += 20) dots.push(dot(x, 6));
// Bottom row: y=254
for (let x = 20; x <= 180; x += 20) dots.push(dot(x, 254));
// Left col: y 30..220 step 20, x=6
for (let y = 30; y <= 220; y += 20) dots.push(dot(6, y));
// Right col: x=194
for (let y = 30; y <= 220; y += 20) dots.push(dot(194, y));

export const dottedBorderFrame: FrameTemplate = {
  id: 'dotted-border',
  name: 'Noktalı',
  category: 'decorative',
  viewBox: '0 0 200 260',
  clipPath: RECT,
  outlinePath: RECT,
  qrZone: { x: 20, y: 20, width: 160, height: 160 },
  ctaBand: {
    position: 'bottom',
    height: 50,
    backgroundColor: '#374151',
    textY: 235,
  },
  decorativeLayers: [
    {
      id: 'dot-border',
      svgPath: dots.join(' '),
      defaultFill: '#6366f1',
      defaultOpacity: 0.85,
      colorRole: 'primary',
    },
  ],
};
