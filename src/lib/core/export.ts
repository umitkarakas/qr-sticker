/** Replace width/height="100%" with the viewBox pixel values so the SVG
 *  has a real intrinsic size when loaded as a standalone blob <img>. */
function withNaturalSize(svgString: string): string {
  const vbMatch = svgString.match(/viewBox="([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)"/);
  if (!vbMatch) return svgString;
  const [, , , w, h] = vbMatch;
  return svgString.replace(
    /<svg([^>]*)>/,
    (_, attrs: string) => {
      const clean = attrs.replace(/\s*(width|height)="[^"]*"/g, '');
      return `<svg${clean} width="${w}" height="${h}">`;
    }
  );
}

export async function exportToPng(
  svgString: string,
  width: number = 800,
  height: number = 800,
  scale: number = 2
): Promise<Blob> {
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  const blob = new Blob([withNaturalSize(svgString)], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  try {
    const img = await loadImage(url);

    const canvas = document.createElement('canvas');
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas 2d context');
    }

    ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error('Canvas toBlob returned null'));
          }
        },
        'image/png'
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function exportToSvg(svgString: string): Blob {
  return new Blob([withNaturalSize(svgString)], { type: 'image/svg+xml;charset=utf-8' });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadPng(
  svgString: string,
  filename: string = 'sticker.png',
  width?: number,
  height?: number,
  scale?: number
): Promise<void> {
  const blob = await exportToPng(svgString, width, height, scale);
  downloadBlob(blob, filename);
}

export function downloadSvg(
  svgString: string,
  filename: string = 'sticker.svg'
): void {
  const blob = exportToSvg(svgString);
  downloadBlob(blob, filename);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}
