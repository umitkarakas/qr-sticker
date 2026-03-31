import type { StickerShape } from './types';

import { squareShape } from './geometric/square';
import { roundedRectShape } from './geometric/rounded-rect';
import { circleShape } from './geometric/circle';
import { ovalShape } from './geometric/oval';
import { pillShape } from './geometric/pill';
import { heartShape } from './figurative/heart';
import { starShape } from './figurative/star';
import { likeShape } from './figurative/like';
import { speechBubbleShape } from './figurative/speech-bubble';
import { hexagonShape } from './figurative/hexagon';

export type { StickerShape } from './types';

const ALL_SHAPES: StickerShape[] = [
  // Geometric
  squareShape,
  roundedRectShape,
  circleShape,
  ovalShape,
  pillShape,
  // Figurative
  heartShape,
  starShape,
  likeShape,
  speechBubbleShape,
  hexagonShape,
];

export const SHAPES = new Map<string, StickerShape>(
  ALL_SHAPES.map(s => [s.id, s])
);

export const SHAPES_BY_CATEGORY = {
  geometric: ALL_SHAPES.filter(s => s.category === 'geometric'),
  figurative: ALL_SHAPES.filter(s => s.category === 'figurative'),
};

export function getShape(id: string): StickerShape {
  const shape = SHAPES.get(id);
  if (!shape) throw new Error(`Shape not found: ${id}`);
  return shape;
}
