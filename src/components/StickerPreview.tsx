import { useEffect, useRef, useState, useCallback } from 'react';
import { useDesigner } from '@/context/DesignerContext';
import { generateQrSvg } from '@/lib/core/qr-engine';
import { composeStickerSvg } from '@/lib/core/composition';
import { downloadPng, downloadSvg } from '@/lib/core/export';
import { getShape } from '@/lib/shapes';
import { getFrame } from '@/lib/frames';
import { composeFrameSvg } from '@/lib/core/frame-composition';
import { CONTENT_TYPES } from '@/lib/core/content-types';
import { Download, ImageIcon } from 'lucide-react';

function getQrData(state: ReturnType<typeof useDesigner>['state']): string {
  const def = CONTENT_TYPES[state.content.type];
  try {
    return def ? def.formatQrData(state.content as never) : '';
  } catch {
    return '';
  }
}

export function StickerPreview() {
  const { state } = useDesigner();
  const [svgString, setSvgString] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildPreview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qrData = getQrData(state);

      let composed: string;

      if (state.frameId) {
        const frame = getFrame(state.frameId);
        const [, , vbW, vbH] = frame.viewBox.split(' ').map(Number);
        const qrSize = Math.max(vbW, vbH);
        const qrSvg = await generateQrSvg(qrData, state.qrStyle, qrSize);
        composed = composeFrameSvg({
          frame,
          qrSvgString: qrSvg,
          backgroundColor: state.backgroundColor,
          borderColor: state.borderColor,
          borderWidth: state.borderWidth,
          cta: state.cta,
          ctaBandColorOverride: state.ctaBandColor,
          decorativeColorOverride: state.decorativeColor,
        });
      } else {
        const shape = getShape(state.shapeId);
        const [vbW, vbH] = shape.viewBox.split(' ').slice(2).map(Number);
        const qrSize = Math.max(vbW, vbH);
        const qrSvg = await generateQrSvg(qrData, state.qrStyle, qrSize);
        composed = composeStickerSvg({
          shape,
          qrSvgString: qrSvg,
          backgroundColor: state.backgroundColor,
          borderColor: state.borderColor,
          borderWidth: state.borderWidth,
          cta: state.cta,
        });
      }

      setSvgString(composed);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Preview generation error:', err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [state]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(buildPreview, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [buildPreview]);

  const handleDownloadPng = async () => {
    if (!svgString) return;
    await downloadPng(svgString, 'sticker.png', 800, 800, 3);
  };

  const handleDownloadSvg = () => {
    if (!svgString) return;
    downloadSvg(svgString, 'sticker.svg');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Preview canvas */}
      <div
        ref={containerRef}
        className="relative w-72 h-72 flex items-center justify-center bg-[#f0f0f0] rounded-2xl border border-gray-200"
        style={{
          backgroundImage:
            'repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%) 0 0 / 16px 16px',
        }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-2xl z-10">
            <div className="w-8 h-8 border-2 border-gray-400 border-t-blue-500 rounded-full animate-spin" />
          </div>
        )}

        {svgString ? (
          <div
            className="w-64 h-64"
            dangerouslySetInnerHTML={{ __html: svgString }}
          />
        ) : error ? (
          <div className="flex flex-col items-center gap-2 text-red-400 px-4 text-center">
            <span className="text-xs font-mono break-all">{error}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <ImageIcon size={40} />
            <span className="text-sm">Önizleme oluşturuluyor…</span>
          </div>
        )}
      </div>

      {/* Export buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleDownloadPng}
          disabled={!svgString || loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Download size={14} />
          PNG indir
        </button>
        <button
          onClick={handleDownloadSvg}
          disabled={!svgString || loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-800 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Download size={14} />
          SVG indir
        </button>
      </div>
    </div>
  );
}
