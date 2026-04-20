'use client';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeleteConfirmModal({ isOpen, onCancel, onConfirm, isDeleting }: DeleteConfirmModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl mx-4">
        <h2 className="text-base font-semibold text-slate-800">QR Kodu Sil</h2>
        <p className="mt-2 text-sm text-slate-600">
          Bu QR kodunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
        </p>
        <div className="flex items-center justify-end gap-2 mt-5">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-50 rounded-lg transition-colors"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors"
          >
            {isDeleting ? 'Siliniyor...' : 'Sil'}
          </button>
        </div>
      </div>
    </div>
  );
}
