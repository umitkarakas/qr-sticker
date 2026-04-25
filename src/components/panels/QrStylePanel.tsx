import { useDesigner } from '@/context/DesignerContext';
import type { DotType, CornerSquareType, CornerDotType, ErrorCorrection } from '@/lib/core/schemas';

const DOT_TYPES: { value: DotType; label: string }[] = [
  { value: 'square', label: 'Kare' },
  { value: 'rounded', label: 'Yuvarlak' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy Yuvarlak' },
  { value: 'extra-rounded', label: 'Extra Yuvarlak' },
  { value: 'dots', label: 'Nokta' },
];

const CORNER_SQUARE_TYPES: { value: CornerSquareType; label: string }[] = [
  { value: 'square', label: 'Kare' },
  { value: 'extra-rounded', label: 'Yuvarlak' },
  { value: 'dot', label: 'Nokta' },
];

const CORNER_DOT_TYPES: { value: CornerDotType; label: string }[] = [
  { value: 'square', label: 'Kare' },
  { value: 'dot', label: 'Nokta' },
];

const ERROR_CORRECTIONS: { value: ErrorCorrection; label: string; note: string }[] = [
  { value: 'L', label: 'L — Düşük', note: '7%' },
  { value: 'M', label: 'M — Orta', note: '15%' },
  { value: 'Q', label: 'Q — Yüksek', note: '25%' },
  { value: 'H', label: 'H — Max', note: '30%' },
];

export function QrStylePanel() {
  const { state, dispatch } = useDesigner();
  const { qrStyle } = state;

  return (
    <div className="flex flex-col gap-5">
      {/* Dot type */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Nokta Tipi
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {DOT_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => dispatch({ type: 'SET_QR_STYLE', payload: { dotType: value } })}
              className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                qrStyle.dotType === value
                  ? 'bg-brand-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-3">
        <ColorField
          label="Nokta Rengi"
          value={qrStyle.dotColor}
          onChange={(v) => dispatch({ type: 'SET_QR_STYLE', payload: { dotColor: v } })}
        />
        <ColorField
          label="Arka Plan"
          value={qrStyle.backgroundColor === 'transparent' ? '#ffffff' : qrStyle.backgroundColor}
          onChange={(v) => dispatch({ type: 'SET_QR_STYLE', payload: { backgroundColor: v } })}
        />
      </div>

      {/* Corner square */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Köşe Kare Tipi
        </label>
        <div className="flex gap-1.5">
          {CORNER_SQUARE_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => dispatch({ type: 'SET_QR_STYLE', payload: { cornerSquareType: value } })}
              className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                qrStyle.cornerSquareType === value
                  ? 'bg-brand-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Corner dot */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Köşe Nokta Tipi
        </label>
        <div className="flex gap-1.5">
          {CORNER_DOT_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => dispatch({ type: 'SET_QR_STYLE', payload: { cornerDotType: value } })}
              className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                qrStyle.cornerDotType === value
                  ? 'bg-brand-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Corner colors */}
      <div className="grid grid-cols-2 gap-3">
        <ColorField
          label="Köşe Kare Rengi"
          value={qrStyle.cornerSquareColor ?? qrStyle.dotColor}
          onChange={(v) => dispatch({ type: 'SET_QR_STYLE', payload: { cornerSquareColor: v } })}
        />
        <ColorField
          label="Köşe Nokta Rengi"
          value={qrStyle.cornerDotColor ?? qrStyle.dotColor}
          onChange={(v) => dispatch({ type: 'SET_QR_STYLE', payload: { cornerDotColor: v } })}
        />
      </div>

      {/* Error correction */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Hata Düzeltme
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {ERROR_CORRECTIONS.map(({ value, label, note }) => (
            <button
              key={value}
              onClick={() => dispatch({ type: 'SET_QR_STYLE', payload: { errorCorrection: value } })}
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                qrStyle.errorCorrection === value
                  ? 'bg-brand-blue text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{label}</span>
              <span className="opacity-60">{note}</span>
            </button>
          ))}
        </div>
        {qrStyle.logo && (
          <p className="text-xs text-amber-600 mt-1.5">
            Logo eklendiğinde minimum Q seviyesi uygulanır.
          </p>
        )}
      </div>

      {/* Sticker colors */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Sticker Renkleri
        </label>
        <div className="grid grid-cols-2 gap-3">
          <ColorField
            label="Arka Plan"
            value={state.backgroundColor}
            onChange={(v) => dispatch({ type: 'SET_BACKGROUND_COLOR', payload: v })}
          />
          <ColorField
            label="Çerçeve"
            value={state.borderColor}
            onChange={(v) => dispatch({ type: 'SET_BORDER_COLOR', payload: v })}
          />
        </div>
        <div className="mt-3">
          <label className="block text-xs text-gray-500 mb-1">
            Çerçeve Kalınlığı: {state.borderWidth}px
          </label>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={state.borderWidth}
            onChange={(e) => dispatch({ type: 'SET_BORDER_WIDTH', payload: Number(e.target.value) })}
            className="w-full accent-brand-blue"
          />
        </div>
      </div>
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-gray-300 p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input flex-1 font-mono text-xs"
          maxLength={7}
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
