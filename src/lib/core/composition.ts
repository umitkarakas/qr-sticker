import type { StickerShape } from '../shapes/types';
import type { CtaConfig } from './schemas';

export interface CompositionInput {
  shape: StickerShape;
  qrSvgString: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  cta: CtaConfig;
}

export function composeStickerSvg(input: CompositionInput): string {
  const { shape, qrSvgString, backgroundColor, borderColor, borderWidth, cta } = input;
  const { qrArea, ctaArea } = shape;

  const { viewBox, innerContent } = extractSvgContent(qrSvgString);

  const parts: string[] = [];

  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${shape.viewBox}" width="100%" height="100%">`
  );

  parts.push(
    `<defs><clipPath id="sticker-clip"><path d="${shape.clipPath}"/></clipPath></defs>`
  );

  parts.push(`<path d="${shape.clipPath}" fill="${backgroundColor}"/>`);

  if (borderWidth > 0) {
    parts.push(
      `<path d="${shape.outlinePath}" fill="none" stroke="${borderColor}" stroke-width="${borderWidth}"/>`
    );
  }

  parts.push(`<g clip-path="url(#sticker-clip)">`);
  parts.push(
    `<svg x="${qrArea.x}" y="${qrArea.y}" width="${qrArea.width}" height="${qrArea.height}" viewBox="${viewBox}">`
  );
  parts.push(innerContent);
  parts.push(`</svg>`);
  parts.push(`</g>`);

  if (ctaArea && cta.text) {
    if (cta.backgroundColor) {
      parts.push(
        `<rect x="${ctaArea.x - ctaArea.width / 2}" y="${ctaArea.y - cta.fontSize}" width="${ctaArea.width}" height="${cta.fontSize + 8}" rx="4" fill="${cta.backgroundColor}"/>`
      );
    }
    parts.push(
      `<text x="${ctaArea.x}" y="${ctaArea.y}" text-anchor="${ctaArea.anchor}" font-size="${cta.fontSize}" font-weight="${cta.fontWeight}" fill="${cta.color}" font-family="Inter, system-ui, sans-serif">${escapeXml(cta.text)}</text>`
    );
  }

  parts.push(`</svg>`);

  return parts.join('\n');
}

function extractSvgContent(svgString: string): { viewBox: string; innerContent: string } {
  const viewBoxMatch = svgString.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 300 300';

  const innerMatch = svgString.match(/<svg[^>]*>([\s\S]*)<\/svg>/i);
  const innerContent = innerMatch ? innerMatch[1] : '';

  return { viewBox, innerContent };
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
