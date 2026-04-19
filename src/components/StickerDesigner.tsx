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

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'content', label: 'İçerik', icon: <Type size={16} /> },
  { id: 'style', label: 'Stil', icon: <Palette size={16} /> },
  { id: 'shape', label: 'Şekil', icon: <Sparkles size={16} /> },
  { id: 'frame', label: 'Çerçeve', icon: <Shapes size={16} /> },
];

export function StickerDesigner() {
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
      const res = await fetch('/api/qr', {
        method: 'POST',
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left panel — controls */}
        <div className="w-full md:w-80 border-r border-gray-100 flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <Save size={13} />
                Kaydet
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex border-b border-gray-100">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
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
        <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center p-8">
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
