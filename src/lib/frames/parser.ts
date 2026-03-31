import type { FrameTemplate } from './types';

export type ParseResult =
  | { ok: true; template: FrameTemplate }
  | { ok: false; error: string };

export function parseUploadedFrameSvg(svgString: string): ParseResult {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, 'image/svg+xml');

    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      return { ok: false, error: 'Geçersiz SVG dosyası.' };
    }

    const svgEl = doc.querySelector('svg');
    if (!svgEl) {
      return { ok: false, error: 'SVG elementi bulunamadı.' };
    }

    const viewBox = svgEl.getAttribute('viewBox') ?? '0 0 200 260';

    const qrZoneEl = doc.querySelector('#qr-zone, [data-role="qr-zone"]');
    if (!qrZoneEl) {
      return {
        ok: false,
        error: 'QR zone bulunamadı. SVG içinde id="qr-zone" olan bir element olmalı.',
      };
    }

    const x = Number(qrZoneEl.getAttribute('x') ?? qrZoneEl.getAttribute('data-x') ?? 20);
    const y = Number(qrZoneEl.getAttribute('y') ?? qrZoneEl.getAttribute('data-y') ?? 20);
    const width = Number(qrZoneEl.getAttribute('width') ?? qrZoneEl.getAttribute('data-width') ?? 160);
    const height = Number(qrZoneEl.getAttribute('height') ?? qrZoneEl.getAttribute('data-height') ?? 160);

    const [, , vbW, vbH] = viewBox.split(' ').map(Number);

    const template: FrameTemplate = {
      id: `upload:${Date.now()}`,
      name: 'Yüklenen Çerçeve',
      category: 'plain',
      viewBox,
      clipPath: `M 0,0 H ${vbW} V ${vbH} H 0 Z`,
      outlinePath: `M 0,0 H ${vbW} V ${vbH} H 0 Z`,
      qrZone: { x, y, width, height },
      ctaBand: {
        position: 'none',
        height: 0,
        backgroundColor: 'transparent',
        textY: vbH - 15,
      },
      decorativeLayers: [],
    };

    return { ok: true, template };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Bilinmeyen hata.',
    };
  }
}
