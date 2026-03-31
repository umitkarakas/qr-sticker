export interface StickerShape {
  id: string;
  name: string;
  category: 'geometric' | 'figurative';
  viewBox: string;
  clipPath: string;
  outlinePath: string;
  qrArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  ctaArea?: {
    x: number;
    y: number;
    width: number;
    anchor: 'middle' | 'start';
  };
}
