import { useDesigner } from '@/context/DesignerContext';
import { FRAMES_BY_CATEGORY } from '@/lib/frames';
import type { FrameTemplate } from '@/lib/frames';
import { X } from 'lucide-react';

export function FramePanel() {
  const { state, dispatch } = useDesigner();
  const allFrames = [
    ...FRAMES_BY_CATEGORY.plain,
    ...FRAMES_BY_CATEGORY.banded,
    ...FRAMES_BY_CATEGORY.decorative,
  ];
  const activeFrame = state.frameId
    ? allFrames.find((f) => f.id === state.frameId)
    : null;

  const hasBand = activeFrame?.ctaBand.position !== 'none';
  const hasDecorations =
    activeFrame &&
    activeFrame.decorativeLayers.some((l) => l.defaultFill !== 'none' && l.defaultFill !== '');

  return (
    <div className="flex flex-col gap-5">
      {/* No frame option */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Çerçeve
        </label>
        <button
          onClick={() => dispatch({ type: 'CLEAR_FRAME' })}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            !state.frameId
              ? 'bg-brand-blue text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <X size={14} />
          Çerçeve Yok (klasik şekil)
        </button>
      </div>

      <FrameGroup
        title="Sade"
        frames={FRAMES_BY_CATEGORY.plain}
        selected={state.frameId}
        onSelect={(id) => dispatch({ type: 'SET_FRAME', payload: id })}
      />
      <FrameGroup
        title="Bantlı"
        frames={FRAMES_BY_CATEGORY.banded}
        selected={state.frameId}
        onSelect={(id) => dispatch({ type: 'SET_FRAME', payload: id })}
      />
      <FrameGroup
        title="Dekoratif"
        frames={FRAMES_BY_CATEGORY.decorative}
        selected={state.frameId}
        onSelect={(id) => dispatch({ type: 'SET_FRAME', payload: id })}
      />

      {/* Frame color overrides */}
      {activeFrame && (
        <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Çerçeve Renkleri
          </label>

          {hasBand && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">Bant Rengi</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={state.ctaBandColor ?? activeFrame.ctaBand.backgroundColor}
                  onChange={(e) =>
                    dispatch({ type: 'SET_CTA_BAND_COLOR', payload: e.target.value })
                  }
                  className="w-8 h-8 rounded cursor-pointer border border-gray-300 p-0.5"
                />
                <input
                  type="text"
                  value={state.ctaBandColor ?? activeFrame.ctaBand.backgroundColor}
                  onChange={(e) =>
                    dispatch({ type: 'SET_CTA_BAND_COLOR', payload: e.target.value })
                  }
                  className="input flex-1 font-mono text-xs"
                  maxLength={7}
                />
                {state.ctaBandColor && (
                  <button
                    onClick={() =>
                      dispatch({
                        type: 'SET_CTA_BAND_COLOR',
                        payload: activeFrame.ctaBand.backgroundColor,
                      })
                    }
                    className="text-gray-400 hover:text-gray-600"
                    title="Varsayılana sıfırla"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          )}

          {hasDecorations && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">Dekorasyon Rengi</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={
                    state.decorativeColor ??
                    activeFrame.decorativeLayers.find((l) => l.defaultFill !== 'none')
                      ?.defaultFill ??
                    '#6366f1'
                  }
                  onChange={(e) =>
                    dispatch({ type: 'SET_DECORATIVE_COLOR', payload: e.target.value })
                  }
                  className="w-8 h-8 rounded cursor-pointer border border-gray-300 p-0.5"
                />
                <input
                  type="text"
                  value={
                    state.decorativeColor ??
                    activeFrame.decorativeLayers.find((l) => l.defaultFill !== 'none')
                      ?.defaultFill ??
                    '#6366f1'
                  }
                  onChange={(e) =>
                    dispatch({ type: 'SET_DECORATIVE_COLOR', payload: e.target.value })
                  }
                  className="input flex-1 font-mono text-xs"
                  maxLength={7}
                />
                {state.decorativeColor && (
                  <button
                    onClick={() =>
                      dispatch({
                        type: 'SET_DECORATIVE_COLOR',
                        payload:
                          activeFrame.decorativeLayers[0]?.defaultFill ?? '#6366f1',
                      })
                    }
                    className="text-gray-400 hover:text-gray-600"
                    title="Varsayılana sıfırla"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FrameGroup({
  title,
  frames,
  selected,
  onSelect,
}: {
  title: string;
  frames: FrameTemplate[];
  selected: string | undefined;
  onSelect: (id: string) => void;
}) {
  if (frames.length === 0) return null;

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {title}
      </label>
      <div className="grid grid-cols-4 gap-2">
        {frames.map((frame) => (
          <FramePreviewButton
            key={frame.id}
            frame={frame}
            isSelected={selected === frame.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

function FramePreviewButton({
  frame,
  isSelected,
  onSelect,
}: {
  frame: FrameTemplate;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  const [, , vbW, vbH] = frame.viewBox.split(' ').map(Number);
  const { qrZone, ctaBand } = frame;
  const bandY = ctaBand.position === 'bottom' ? vbH - ctaBand.height : 0;

  return (
    <button
      onClick={() => onSelect(frame.id)}
      title={frame.name}
      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
        isSelected
          ? 'bg-brand-blue shadow-md ring-2 ring-brand-blue/40'
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
    >
      <svg viewBox={frame.viewBox} width="42" height="42" className="overflow-visible">
        {/* Background */}
        <path
          d={frame.clipPath}
          fill={isSelected ? 'rgba(255,255,255,0.15)' : '#f3f4f6'}
        />

        {/* Decorative layers */}
        {frame.decorativeLayers.map((layer) =>
          layer.svgPath.trim().startsWith('<') ? (
            <g
              key={layer.id}
              opacity={layer.defaultOpacity}
              dangerouslySetInnerHTML={{ __html: layer.svgPath }}
            />
          ) : (
            <path
              key={layer.id}
              d={layer.svgPath}
              fill={layer.defaultFill}
              opacity={layer.defaultOpacity}
            />
          )
        )}

        {/* QR zone */}
        <rect
          x={qrZone.x}
          y={qrZone.y}
          width={qrZone.width}
          height={qrZone.height}
          fill={isSelected ? 'rgba(255,255,255,0.3)' : '#e5e7eb'}
          rx="2"
        />
        {/* Grid lines to suggest QR */}
        {[1, 2].map((i) => (
          <line
            key={`v${i}`}
            x1={qrZone.x + (qrZone.width * i) / 3}
            y1={qrZone.y}
            x2={qrZone.x + (qrZone.width * i) / 3}
            y2={qrZone.y + qrZone.height}
            stroke={isSelected ? 'rgba(255,255,255,0.2)' : '#d1d5db'}
            strokeWidth="1"
          />
        ))}
        {[1, 2].map((i) => (
          <line
            key={`h${i}`}
            x1={qrZone.x}
            y1={qrZone.y + (qrZone.height * i) / 3}
            x2={qrZone.x + qrZone.width}
            y2={qrZone.y + (qrZone.height * i) / 3}
            stroke={isSelected ? 'rgba(255,255,255,0.2)' : '#d1d5db'}
            strokeWidth="1"
          />
        ))}

        {/* CTA band */}
        {ctaBand.position !== 'none' && (
          <rect
            x={0}
            y={bandY}
            width={vbW}
            height={ctaBand.height}
            fill={isSelected ? 'rgba(255,255,255,0.25)' : ctaBand.backgroundColor}
          />
        )}
      </svg>
      <span
        className={`text-[9px] font-medium leading-tight text-center line-clamp-2 ${
          isSelected ? 'text-white' : 'text-gray-600'
        }`}
      >
        {frame.name}
      </span>
    </button>
  );
}
