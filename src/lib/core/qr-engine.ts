import QRCodeStyling from 'qr-code-styling';
import type { QrStyle } from './schemas';

function makeFallbackSvg(size: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#e5e7eb" rx="8"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-size="48" fill="#9ca3af" font-family="Inter, system-ui, sans-serif">QR</text></svg>`;
}

export async function generateQrSvg(
  data: string,
  style: QrStyle,
  size: number = 300
): Promise<string> {
  if (!data) {
    return makeFallbackSvg(size);
  }

  let errorCorrectionLevel = style.errorCorrection;
  if (style.logo && (errorCorrectionLevel === 'L' || errorCorrectionLevel === 'M')) {
    errorCorrectionLevel = 'Q';
  }

  const qrCode = new QRCodeStyling({
    width: size,
    height: size,
    type: 'svg',
    data,
    dotsOptions: {
      type: style.dotType,
      color: style.dotColor,
      gradient: mapGradient(style.dotGradient),
    },
    cornersSquareOptions: {
      type: style.cornerSquareType,
      color: style.cornerSquareColor,
    },
    cornersDotOptions: {
      type: style.cornerDotType,
      color: style.cornerDotColor,
    },
    backgroundOptions: {
      color: style.backgroundColor === 'transparent' ? '#ffffff' : style.backgroundColor,
    },
    image: style.logo?.dataUrl,
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: style.logo?.size ?? 0.4,
      margin: style.logo?.margin ?? 0,
      crossOrigin: 'anonymous',
    },
    qrOptions: {
      errorCorrectionLevel,
    },
  });

  // Use append() → DOM read approach — most reliable in browser context
  const container = document.createElement('div');
  container.style.cssText =
    'position:absolute;left:-9999px;top:-9999px;visibility:hidden;pointer-events:none';
  document.body.appendChild(container);

  try {
    qrCode.append(container);

    // Wait for internal drawing to complete.
    // qr-code-styling exposes _svgDrawingPromise on the instance.
    const internalPromise = (qrCode as unknown as Record<string, unknown>)[
      '_svgDrawingPromise'
    ] as Promise<void> | undefined;
    if (internalPromise) {
      await internalPromise;
    } else {
      // Fallback: one rAF tick is enough for synchronous SVG construction
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }

    const svgEl = container.querySelector('svg');
    if (!svgEl) {
      return makeFallbackSvg(size);
    }

    // Ensure viewBox is set
    if (!svgEl.getAttribute('viewBox')) {
      svgEl.setAttribute('viewBox', `0 0 ${size} ${size}`);
    }

    const serializer = new XMLSerializer();
    return serializer.serializeToString(svgEl);
  } catch {
    return makeFallbackSvg(size);
  } finally {
    document.body.removeChild(container);
  }
}

function mapGradient(gradient?: {
  type: 'linear' | 'radial';
  rotation?: number;
  colorStops: { offset: number; color: string }[];
}) {
  if (!gradient) return undefined;
  return {
    type: gradient.type,
    rotation: gradient.rotation || 0,
    colorStops: gradient.colorStops.map((cs) => ({
      offset: cs.offset,
      color: cs.color,
    })),
  };
}
