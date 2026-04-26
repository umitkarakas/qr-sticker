import type { DesignerState } from '@/lib/core/schemas';

export const restaurantPreset: Partial<DesignerState> = {
  content: { type: 'menu', url: '' },
  frameId: 'banded-bottom',
  cta: { text: 'Menüyü Gör', color: '#333333', fontSize: 14, fontWeight: 600 },
};
