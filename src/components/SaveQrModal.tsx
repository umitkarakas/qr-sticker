'use client';

import { useState, useEffect } from 'react';

interface SaveQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void>;
  isSaving: boolean;
  error: string | null;
}

export function SaveQrModal({ isOpen, onClose, onSave, isSaving, error }: SaveQrModalProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (name.trim().length === 0 || isSaving) return;
    await onSave(name.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSaving) {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl mx-4">
        <h2 className="text-base font-semibold text-gray-800">QR Kodunuzu Adlandırın</h2>

        <label className="block mt-4">
          <span className="text-xs font-medium text-gray-600">QR Adı</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="örn. Restoran Menüsü"
            autoFocus
            disabled={isSaving}
            className="w-full mt-2 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
        </label>

        {error !== null && (
          <p className="mt-2 text-xs text-red-600">{error}</p>
        )}

        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving || name.trim().length === 0}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-brand-blue hover:bg-[#1a93c5] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}
