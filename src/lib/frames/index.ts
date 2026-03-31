import type { FrameTemplate } from './types';
import { plainSquareFrame } from './builtin/plain-square';
import { cornerDotsFrame } from './builtin/corner-dots';
import { scanMeBandFrame } from './builtin/scan-me-band';
import { cornerBracketsFrame } from './builtin/corner-brackets';
import { pillBandFrame } from './builtin/pill-band';
import { roundedBadgeFrame } from './builtin/rounded-badge';
import { dottedBorderFrame } from './builtin/dotted-border';
import { doubleBorderFrame } from './builtin/double-border';

export type { FrameTemplate } from './types';

const ALL_FRAMES: FrameTemplate[] = [
  plainSquareFrame,
  pillBandFrame,
  roundedBadgeFrame,
  scanMeBandFrame,
  cornerDotsFrame,
  cornerBracketsFrame,
  dottedBorderFrame,
  doubleBorderFrame,
];

export const FRAMES = new Map<string, FrameTemplate>(
  ALL_FRAMES.map(f => [f.id, f])
);

export const FRAMES_BY_CATEGORY = {
  plain: ALL_FRAMES.filter(f => f.category === 'plain'),
  decorative: ALL_FRAMES.filter(f => f.category === 'decorative'),
  banded: ALL_FRAMES.filter(f => f.category === 'banded'),
};

export function getFrame(id: string): FrameTemplate {
  const frame = FRAMES.get(id);
  if (!frame) throw new Error(`Frame not found: ${id}`);
  return frame;
}
