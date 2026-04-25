'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { StickerPreview } from './StickerPreview';
import { ContentPanel } from './panels/ContentPanel';
import { QrStylePanel } from './panels/QrStylePanel';
import { FramePanel } from './panels/FramePanel';
import { ShapePanel } from './panels/ShapePanel';
import { Type, Palette, Shapes, RotateCcw, Sparkles, Save } from 'lucide-react';
import { useDesigner } from '@/context/DesignerContext';
import { SaveQrModal } from './SaveQrModal';

type Tab = 'content' | 'style' | 'shape' | 'frame';

interface StickerDesignerProps {
  editId?: string;
  editTitle?: string;
}

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'content', label: 'İçerik', icon: <Type size={16} /> },
  { id: 'style', label: 'Stil', icon: <Palette size={16} /> },
  { id: 'shape', label: 'Şekil', icon: <Sparkles size={16} /> },
  { id: 'frame', label: 'Çerçeve', icon: <Shapes size={16} /> },
];

export function StickerDesigner({ editId, editTitle }: StickerDesignerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const router = useRouter();
  const { status } = useSession();
  const { state, dispatch } = useDesigner();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSaveClick = () => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    setSaveError(null);
    // Edit mode: skip the name modal, save directly with the existing title
    if (editId && editTitle) {
      void handleSave(editTitle);
      return;
    }
    setIsModalOpen(true);
  };

  const handleSave = async (name: string) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const body = {
        name,
        contentType: state.content.type,
        content: state.content,
        qrStyle: state.qrStyle,
        shapeId: state.shapeId,
        frameId: state.frameId,
        ctaBandColor: state.ctaBandColor,
        decorativeColor: state.decorativeColor,
        backgroundColor: state.backgroundColor,
        borderColor: state.borderColor,
        borderWidth: state.borderWidth,
        cta: state.cta,
      };
      const url = editId ? `/api/qr/${editId}` : '/api/qr';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSaveError(data?.error ?? 'Kaydetme başarısız oldu. Lütfen tekrar deneyin.');
        return;
      }
      setIsModalOpen(false);
      router.push('/dashboard');
    } catch {
      setSaveError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className="w-full max-w-4xl overflow-hidden flex flex-col md:flex-row"
        style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.9)',
          borderRadius: 24,
          boxShadow: '0 12px 48px rgba(32,80,140,0.12), inset 0 1px 0 rgba(255,255,255,0.95)',
        }}
      >
        {/* Left panel — controls */}
        <div className="w-full md:w-80 flex flex-col" style={{ borderRight: '1px solid rgba(203,213,225,0.4)' }}>
          {/* Header */}
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(243,244,246,0.8)' }}>
            <h1 className="text-base font-bold text-gray-800">QR Sticker Designer</h1>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => dispatch({ type: 'RESET' })}
                title="Sıfırla"
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={handleSaveClick}
                disabled={status === 'loading'}
                title="Kaydet"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-brand-blue hover:bg-[#1a93c5] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <Save size={13} />
                Kaydet
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex" style={{ borderBottom: '1px solid rgba(243,244,246,0.8)' }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'text-brand-blue border-b-2 border-brand-blue'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-5">
            {activeTab === 'content' && <ContentPanel />}
            {activeTab === 'style' && <QrStylePanel />}
            {activeTab === 'shape' && <ShapePanel />}
            {activeTab === 'frame' && <FramePanel />}
          </div>
        </div>

        {/* Right panel — preview */}
        <div
          className="flex-1 flex flex-col items-center justify-center p-8"
          style={{ background: 'rgba(238,244,251,0.7)' }}
        >
          <StickerPreview />
        </div>
      </div>

      <SaveQrModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSaveError(null); }}
        onSave={handleSave}
        isSaving={isSaving}
        error={saveError}
      />
    </div>
  );
}
