'use client';

import { useState } from 'react';
import Link from 'next/link';
import { QrCard, type QrCardData } from './QrCard';
import { DeleteConfirmModal } from './DeleteConfirmModal';

interface QrGridProps {
  initialQrCodes: QrCardData[];
}

export function QrGrid({ initialQrCodes }: QrGridProps) {
  const [qrCodes, setQrCodes] = useState<QrCardData[]>(initialQrCodes);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteRequest = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/qr/${deleteTargetId}`, { method: 'DELETE' });
      if (res.ok) {
        setQrCodes((prev) => prev.filter((qr) => qr.id !== deleteTargetId));
      }
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  const handleDuplicateRequest = async (id: string) => {
    const res = await fetch(`/api/qr/${id}/duplicate`, { method: 'POST' });
    if (res.ok) {
      const duplicate: QrCardData = await res.json();
      setQrCodes((prev) => [duplicate, ...prev]);
    }
  };

  if (qrCodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-20 px-6 text-center">
        <p className="text-lg font-semibold text-slate-700">Henüz QR kodun yok</p>
        <p className="mt-2 text-sm text-slate-500">İlk QR kodunu oluşturmak için aşağıdaki butona tıkla.</p>
        <Link
          href="/qr-code-generator"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-fuchsia-700 transition-colors"
        >
          QR Kodu Oluştur
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {qrCodes.map((qr) => (
          <QrCard
            key={qr.id}
            qr={qr}
            onDeleteRequest={handleDeleteRequest}
            onDuplicateRequest={handleDuplicateRequest}
          />
        ))}
      </div>

      <DeleteConfirmModal
        isOpen={deleteTargetId !== null}
        onCancel={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </>
  );
}
