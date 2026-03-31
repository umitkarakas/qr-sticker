import type { StickerShape } from '../shapes/types';
import type { FrameTemplate } from './types';

export function shapeToFrameTemplate(shape: StickerShape): FrameTemplate {
  const [, , , vbH] = shape.viewBox.split(' ').map(Number);

  const ctaBandY = shape.ctaArea?.y ?? (vbH - 30);
  const bandHeight = vbH - ctaBandY + 10;

  return {
    id: `shape:${shape.id}`,
    name: shape.name,
    category: 'plain',
    viewBox: shape.viewBox,
    clipPath: shape.clipPath,
    outlinePath: shape.outlinePath,
    qrZone: shape.qrArea,
    ctaBand: {
      position: shape.ctaArea ? 'bottom' : 'none',
      height: Math.max(bandHeight, 30),
      backgroundColor: 'transparent',
      textY: shape.ctaArea?.y ?? ctaBandY,
    },
    decorativeLayers: [],
  };
}
