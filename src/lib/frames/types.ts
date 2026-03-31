export type FrameCategory = 'plain' | 'decorative' | 'banded';

export interface QrZone {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CtaBand {
  position: 'bottom' | 'top' | 'none';
  height: number;
  backgroundColor: string;
  textY: number;
}

export interface DecorativeLayer {
  id: string;
  svgPath: string;
  defaultFill: string;
  defaultOpacity: number;
  colorRole: 'primary' | 'secondary' | 'accent';
}

export interface FrameTemplate {
  id: string;
  name: string;
  category: FrameCategory;
  viewBox: string;
  clipPath: string;
  outlinePath: string;
  qrZone: QrZone;
  ctaBand: CtaBand;
  decorativeLayers: DecorativeLayer[];
}
