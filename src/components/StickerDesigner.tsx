import { useState } from 'react';
import { StickerPreview } from './StickerPreview';
import { ContentPanel } from './panels/ContentPanel';
import { QrStylePanel } from './panels/QrStylePanel';
import { FramePanel } from './panels/FramePanel';
import { Type, Palette, Shapes, RotateCcw } from 'lucide-react';
import { useDesigner } from '@/context/DesignerContext';

type Tab = 'content' | 'style' | 'frame';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'content', label: 'İçerik', icon: <Type size={16} /> },
  { id: 'style', label: 'Stil', icon: <Palette size={16} /> },
  { id: 'frame', label: 'Çerçeve', icon: <Shapes size={16} /> },
];

export function StickerDesigner() {
  const [activeTab, setActiveTab] = useState<Tab>('content');
  const { dispatch } = useDesigner();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left panel — controls */}
        <div className="w-full md:w-80 border-r border-gray-100 flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h1 className="text-base font-bold text-gray-800">QR Sticker Designer</h1>
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              title="Sıfırla"
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <RotateCcw size={15} />
            </button>
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
            {activeTab === 'frame' && <FramePanel />}
          </div>
        </div>

        {/* Right panel — preview */}
        <div className="flex-1 bg-gray-50 flex flex-col items-center justify-center p-8 gap-6">
          <StickerPreview />

          <p className="text-xs text-gray-400 text-center max-w-xs">
            PNG çıktısı 800×800px @ 3x (baskı kalitesi).
            SVG dosyası sınırsız çözünürlük.
          </p>
        </div>
      </div>
    </div>
  );
}
