import type { DesignerState } from '@/lib/core/schemas';
import { restaurantPreset } from './restaurant';

const PRESETS: Record<string, Partial<DesignerState>> = {
  restaurant: restaurantPreset,
};

export function getPreset(key: string): Partial<DesignerState> | undefined {
  return PRESETS[key];
}
