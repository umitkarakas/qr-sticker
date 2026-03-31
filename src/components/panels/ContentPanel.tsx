import { useDesigner } from '@/context/DesignerContext';
import { CONTENT_TYPES } from '@/lib/core/content-types';
import type { ContentData, ContentType } from '@/lib/core/schemas';
import {
  Globe, Instagram, MessageCircle, Wifi, UserPlus,
  Star, UtensilsCrossed, Phone, Mail, MapPin,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  Globe: <Globe size={16} />,
  Instagram: <Instagram size={16} />,
  MessageCircle: <MessageCircle size={16} />,
  Wifi: <Wifi size={16} />,
  UserPlus: <UserPlus size={16} />,
  Star: <Star size={16} />,
  UtensilsCrossed: <UtensilsCrossed size={16} />,
  Phone: <Phone size={16} />,
  Mail: <Mail size={16} />,
  MapPin: <MapPin size={16} />,
};

function getDefaultContent(type: ContentType): ContentData {
  switch (type) {
    case 'url': return { type: 'url', url: 'https://' };
    case 'instagram': return { type: 'instagram', username: '' };
    case 'whatsapp': return { type: 'whatsapp', phone: '' };
    case 'wifi': return { type: 'wifi', ssid: '', password: '', encryption: 'WPA' };
    case 'vcard': return { type: 'vcard', firstName: '', lastName: '' };
    case 'google-review': return { type: 'google-review', url: 'https://' };
    case 'menu': return { type: 'menu', url: 'https://' };
    case 'phone': return { type: 'phone', phone: '' };
    case 'email': return { type: 'email', email: '' };
    case 'location': return { type: 'location', url: 'https://maps.google.com' };
  }
}

export function ContentPanel() {
  const { state, dispatch } = useDesigner();
  const currentType = state.content.type;

  const handleTypeChange = (type: ContentType) => {
    if (type === currentType) return;
    const defaultContent = getDefaultContent(type);
    dispatch({ type: 'SET_CONTENT', payload: defaultContent });
    dispatch({ type: 'SET_CTA', payload: { text: CONTENT_TYPES[type].defaultCta } });
  };

  const updateContent = (patch: Partial<ContentData>) => {
    dispatch({ type: 'SET_CONTENT', payload: { ...state.content, ...patch } as ContentData });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Type selector */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          İçerik Tipi
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.values(CONTENT_TYPES).map((cfg) => (
            <button
              key={cfg.type}
              onClick={() => handleTypeChange(cfg.type)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                currentType === cfg.type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {ICON_MAP[cfg.iconName]}
              {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic form */}
      <div className="flex flex-col gap-3">
        {currentType === 'url' && (
          <Field label="URL">
            <input
              type="url"
              value={(state.content as Extract<ContentData, { type: 'url' }>).url}
              onChange={(e) => updateContent({ url: e.target.value })}
              placeholder="https://example.com"
              className="input"
            />
          </Field>
        )}

        {currentType === 'instagram' && (
          <Field label="Kullanıcı Adı">
            <input
              type="text"
              value={(state.content as Extract<ContentData, { type: 'instagram' }>).username}
              onChange={(e) => updateContent({ username: e.target.value })}
              placeholder="@kullaniciadi"
              className="input"
            />
          </Field>
        )}

        {currentType === 'whatsapp' && (
          <>
            <Field label="Telefon Numarası">
              <input
                type="tel"
                value={(state.content as Extract<ContentData, { type: 'whatsapp' }>).phone}
                onChange={(e) => updateContent({ phone: e.target.value })}
                placeholder="+905001234567"
                className="input"
              />
            </Field>
            <Field label="Mesaj (opsiyonel)">
              <input
                type="text"
                value={(state.content as Extract<ContentData, { type: 'whatsapp' }>).message ?? ''}
                onChange={(e) => updateContent({ message: e.target.value || undefined })}
                placeholder="Merhaba!"
                className="input"
              />
            </Field>
          </>
        )}

        {currentType === 'wifi' && (
          <>
            <Field label="Ağ Adı (SSID)">
              <input
                type="text"
                value={(state.content as Extract<ContentData, { type: 'wifi' }>).ssid}
                onChange={(e) => updateContent({ ssid: e.target.value })}
                placeholder="WiFi Adı"
                className="input"
              />
            </Field>
            <Field label="Şifre">
              <input
                type="text"
                value={(state.content as Extract<ContentData, { type: 'wifi' }>).password}
                onChange={(e) => updateContent({ password: e.target.value })}
                placeholder="WiFi şifresi"
                className="input"
              />
            </Field>
            <Field label="Güvenlik">
              <select
                value={(state.content as Extract<ContentData, { type: 'wifi' }>).encryption}
                onChange={(e) => updateContent({ encryption: e.target.value as 'WPA' | 'WEP' | 'nopass' })}
                className="input"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Şifresiz</option>
              </select>
            </Field>
          </>
        )}

        {currentType === 'vcard' && (
          <>
            <Field label="Ad">
              <input
                type="text"
                value={(state.content as Extract<ContentData, { type: 'vcard' }>).firstName}
                onChange={(e) => updateContent({ firstName: e.target.value })}
                placeholder="Ad"
                className="input"
              />
            </Field>
            <Field label="Soyad">
              <input
                type="text"
                value={(state.content as Extract<ContentData, { type: 'vcard' }>).lastName ?? ''}
                onChange={(e) => updateContent({ lastName: e.target.value })}
                placeholder="Soyad"
                className="input"
              />
            </Field>
            <Field label="Telefon">
              <input
                type="tel"
                value={(state.content as Extract<ContentData, { type: 'vcard' }>).phone ?? ''}
                onChange={(e) => updateContent({ phone: e.target.value || undefined })}
                placeholder="+90..."
                className="input"
              />
            </Field>
            <Field label="E-posta">
              <input
                type="email"
                value={(state.content as Extract<ContentData, { type: 'vcard' }>).email ?? ''}
                onChange={(e) => updateContent({ email: e.target.value || undefined })}
                placeholder="email@example.com"
                className="input"
              />
            </Field>
            <Field label="Şirket">
              <input
                type="text"
                value={(state.content as Extract<ContentData, { type: 'vcard' }>).org ?? ''}
                onChange={(e) => updateContent({ org: e.target.value || undefined })}
                placeholder="Şirket adı"
                className="input"
              />
            </Field>
          </>
        )}

        {currentType === 'google-review' && (
          <Field label="Google Yorum Linki">
            <input
              type="url"
              value={(state.content as Extract<ContentData, { type: 'google-review' }>).url}
              onChange={(e) => updateContent({ url: e.target.value })}
              placeholder="https://g.page/r/..."
              className="input"
            />
          </Field>
        )}

        {currentType === 'menu' && (
          <Field label="Menü URL">
            <input
              type="url"
              value={(state.content as Extract<ContentData, { type: 'menu' }>).url}
              onChange={(e) => updateContent({ url: e.target.value })}
              placeholder="https://menu.example.com"
              className="input"
            />
          </Field>
        )}

        {currentType === 'phone' && (
          <Field label="Telefon">
            <input
              type="tel"
              value={(state.content as Extract<ContentData, { type: 'phone' }>).phone}
              onChange={(e) => updateContent({ phone: e.target.value })}
              placeholder="+905001234567"
              className="input"
            />
          </Field>
        )}

        {currentType === 'email' && (
          <>
            <Field label="E-posta">
              <input
                type="email"
                value={(state.content as Extract<ContentData, { type: 'email' }>).email}
                onChange={(e) => updateContent({ email: e.target.value })}
                placeholder="info@example.com"
                className="input"
              />
            </Field>
            <Field label="Konu (opsiyonel)">
              <input
                type="text"
                value={(state.content as Extract<ContentData, { type: 'email' }>).subject ?? ''}
                onChange={(e) => updateContent({ subject: e.target.value || undefined })}
                placeholder="Konu"
                className="input"
              />
            </Field>
          </>
        )}

        {currentType === 'location' && (
          <Field label="Google Maps Linki">
            <input
              type="url"
              value={(state.content as Extract<ContentData, { type: 'location' }>).url}
              onChange={(e) => updateContent({ url: e.target.value })}
              placeholder="https://maps.google.com/..."
              className="input"
            />
          </Field>
        )}
      </div>

      {/* CTA text */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          CTA Metni
        </label>
        <input
          type="text"
          value={state.cta.text}
          onChange={(e) => dispatch({ type: 'SET_CTA', payload: { text: e.target.value } })}
          placeholder="Örn: Ziyaret edin"
          className="input"
        />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}
