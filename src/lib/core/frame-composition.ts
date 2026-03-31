import type { FrameTemplate } from '../frames/types';
import type { CtaConfig } from './schemas';

export interface FrameCompositionInput {
  frame: FrameTemplate;
  qrSvgString: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  cta: CtaConfig;
  decorativeColorOverride?: string;
  ctaBandColorOverride?: string;
}

export function composeFrameSvg(input: FrameCompositionInput): string {
  const {
    frame,
    qrSvgString,
    backgroundColor,
    borderColor,
    borderWidth,
    cta,
    decorativeColorOverride,
    ctaBandColorOverride,
  } = input;
  const { qrZone, ctaBand } = frame;

  const { viewBox: qrViewBox, innerContent } = extractSvgContent(qrSvgString);

  const parts: string[] = [];

  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${frame.viewBox}">`);

  parts.push(`<defs><clipPath id="frame-clip"><path d="${frame.clipPath}"/></clipPath></defs>`);

  parts.push(`<path d="${frame.clipPath}" fill="${backgroundColor}"/>`);

  if (borderWidth > 0) {
    parts.push(
      `<path d="${frame.outlinePath}" fill="none" stroke="${borderColor}" stroke-width="${borderWidth}"/>`
    );
  }

  for (const layer of frame.decorativeLayers) {
    const fill = decorativeColorOverride ?? layer.defaultFill;
    const opacity = layer.defaultOpacity;
    if (layer.svgPath.trim().startsWith('<')) {
      parts.push(`<g opacity="${opacity}">${layer.svgPath}</g>`);
    } else {
      parts.push(`<path d="${layer.svgPath}" fill="${fill}" opacity="${opacity}"/>`);
    }
  }

  parts.push(`<g clip-path="url(#frame-clip)">`);
  parts.push(
    `<svg x="${qrZone.x}" y="${qrZone.y}" width="${qrZone.width}" height="${qrZone.height}" viewBox="${qrViewBox}">`
  );
  parts.push(innerContent);
  parts.push(`</svg>`);
  parts.push(`</g>`);

  if (ctaBand.position !== 'none' && cta.text) {
    const [, , vbW, vbH] = frame.viewBox.split(' ').map(Number);
    const bandColor = ctaBandColorOverride ?? ctaBand.backgroundColor;
    const bandY = ctaBand.position === 'bottom' ? vbH - ctaBand.height : 0;

    parts.push(
      `<rect x="0" y="${bandY}" width="${vbW}" height="${ctaBand.height}" fill="${bandColor}"/>`
    );

    const textColor = cta.color;
    parts.push(
      `<text x="${vbW / 2}" y="${ctaBand.textY}" text-anchor="middle" font-size="${cta.fontSize}" font-weight="${cta.fontWeight}" fill="${textColor}" font-family="Inter, system-ui, sans-serif">${escapeXml(cta.text)}</text>`
    );
  } else if (ctaBand.position === 'none' && cta.text) {
    const [, , vbW, vbH] = frame.viewBox.split(' ').map(Number);
    if (cta.backgroundColor) {
      parts.push(
        `<rect x="${vbW / 2 - 80}" y="${vbH - cta.fontSize - 12}" width="160" height="${cta.fontSize + 8}" rx="4" fill="${cta.backgroundColor}"/>`
      );
    }
    parts.push(
      `<text x="${vbW / 2}" y="${vbH - 8}" text-anchor="middle" font-size="${cta.fontSize}" font-weight="${cta.fontWeight}" fill="${cta.color}" font-family="Inter, system-ui, sans-serif">${escapeXml(cta.text)}</text>`
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
