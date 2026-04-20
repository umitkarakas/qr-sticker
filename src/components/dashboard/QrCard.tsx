'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Copy, Trash2 } from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';
import type { DotType, CornerSquareType, CornerDotType } from 'qr-code-styling';

// QrCodeType → URL path segment
const QR_TYPE_TO_ROUTE_SEGMENT: Record<string, string> = {
  URL: 'url', MAP: 'location', PHONE: 'phone',
  EMAIL: 'email', WHATSAPP: 'whatsapp', WIFI: 'wifi', VCARD: 'vcard',
};

// Friendly type labels
const QR_TYPE_LABELS: Record<string, string> = {
  URL: 'URL', MAP: 'Konum', PHONE: 'Telefon',
  EMAIL: 'E-posta', WHATSAPP: 'WhatsApp', WIFI: 'WiFi', VCARD: 'Kart',
};

export interface QrCardData {
  id: string;
  type: string;
  title: string;
  createdAt: string;
  content: { payload: unknown } | null;
  design: {
    shapeId: string | null;
    frameId: string | null;
    style: Record<string, unknown>;
  } | null;
}

interface QrCardProps {
  qr: QrCardData;
  onDeleteRequest: (id: string) => void;
  onDuplicateRequest: (id: string) => void;
}

export function QrCard({ qr, onDeleteRequest, onDuplicateRequest }: QrCardProps) {
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const payload = qr.content?.payload as Record<string, unknown> | undefined;
    const style = qr.design?.style ?? {};
    const qrStyle = (style.qrStyle ?? {}) as Record<string, unknown>;

    // Derive a plain string value to encode
    const data = deriveQrData(qr.type, payload);

    const qrCode = new QRCodeStyling({
      width: 120,
      height: 120,
      data,
      dotsOptions: {
        type: ((qrStyle.dotType as string | undefined) ?? 'rounded') as DotType,
        color: (qrStyle.dotColor as string | undefined) ?? '#000000',
      },
      backgroundOptions: {
        color: (qrStyle.backgroundColor as string | undefined) ?? 'transparent',
      },
      cornersSquareOptions: {
        type: ((qrStyle.cornerSquareType as string | undefined) ?? 'extra-rounded') as CornerSquareType,
      },
      cornersDotOptions: {
        type: ((qrStyle.cornerDotType as string | undefined) ?? 'dot') as CornerDotType,
      },
      qrOptions: {
        errorCorrectionLevel: (qrStyle.errorCorrection as 'L' | 'M' | 'Q' | 'H' | undefined) ?? 'M',
      },
    });

    qrCode.append(canvasRef.current);

    // Extract data URL from the appended canvas
    const canvas = canvasRef.current.querySelector('canvas');
    if (canvas) {
      // qr-code-styling renders async — short delay before extracting
      setTimeout(() => {
        setThumbnailUrl(canvas.toDataURL());
      }, 150);
    }

    return () => {
      if (canvasRef.current) canvasRef.current.innerHTML = '';
    };
  }, [qr.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEdit = () => {
    const segment = QR_TYPE_TO_ROUTE_SEGMENT[qr.type] ?? 'url';
    router.push(`/qr-code-generator/${segment}?edit=${qr.id}`);
  };

  const formattedDate = new Date(qr.createdAt).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
      {/* Thumbnail area */}
      <div className="flex items-center justify-center bg-slate-50 p-4 h-36 relative">
        <div ref={canvasRef} className="absolute opacity-0 pointer-events-none" aria-hidden="true" />
        {thumbnailUrl && (
          <img src={thumbnailUrl} alt={qr.title} className="h-28 w-28 object-contain" />
        )}
        {!thumbnailUrl && (
          <div className="h-28 w-28 rounded-lg bg-slate-200 animate-pulse" />
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900 leading-tight line-clamp-2">{qr.title}</p>
          <span className="shrink-0 text-xs font-medium text-fuchsia-600 bg-fuchsia-50 rounded-full px-2 py-0.5">
            {QR_TYPE_LABELS[qr.type] ?? qr.type}
          </span>
        </div>
        <p className="text-xs text-slate-400">{formattedDate}</p>
      </div>

      {/* Action buttons */}
      <div className="border-t border-slate-100 flex">
        <button
          onClick={handleEdit}
          title="Düzenle"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <Pencil size={14} />
          Düzenle
        </button>
        <button
          onClick={() => onDuplicateRequest(qr.id)}
          title="Kopyala"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors border-x border-slate-100"
        >
          <Copy size={14} />
          Kopyala
        </button>
        <button
          onClick={() => onDeleteRequest(qr.id)}
          title="Sil"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <Trash2 size={14} />
          Sil
        </button>
      </div>
    </div>
  );
}

// Helper: derive a QR-encodable string from type + payload
function deriveQrData(type: string, payload: Record<string, unknown> | undefined): string {
  if (!payload) return 'https://example.com';
  switch (type) {
    case 'URL': return (payload.url as string) || 'https://example.com';
    case 'PHONE': return `tel:${payload.phone ?? ''}`;
    case 'EMAIL': return `mailto:${payload.email ?? ''}`;
    case 'WHATSAPP': return `https://wa.me/${payload.phone ?? ''}`;
    case 'WIFI': return `WIFI:T:${payload.encryption ?? 'WPA'};S:${payload.ssid ?? ''};P:${payload.password ?? ''};;`;
    case 'MAP': return (payload.url as string) || 'https://maps.google.com';
    case 'VCARD': return `BEGIN:VCARD\nVERSION:3.0\nFN:${payload.firstName ?? ''} ${payload.lastName ?? ''}\nEND:VCARD`;
    default: return 'https://example.com';
  }
}
