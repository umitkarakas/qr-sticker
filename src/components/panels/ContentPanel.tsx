import { useDesigner } from '@/context/DesignerContext';
import { CONTENT_TYPES, getDefaultContent } from '@/lib/core/content-types';
import type { ContentData, ContentType } from '@/lib/core/schemas';
import {
  Globe, Instagram, MessageCircle, Wifi, UserPlus,
  Star, UtensilsCrossed, Phone, Mail, MapPin,
} from 'lucide-react';
import { UrlForm, PhoneForm, MapForm, EmailForm, WhatsAppForm, WiFiForm, VCardForm } from './content';

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

function renderForm(
  type: ContentType,
  updateContent: (patch: Partial<ContentData>) => void,
  state: ReturnType<typeof useDesigner>['state'],
): React.ReactNode {
  switch (type) {
    case 'url':       return <UrlForm />;
    case 'phone':     return <PhoneForm />;
    case 'location':  return <MapForm />;
    case 'email':     return <EmailForm />;
    case 'whatsapp':  return <WhatsAppForm />;
    case 'wifi':      return <WiFiForm />;
    case 'vcard':     return <VCardForm />;
    // Remaining types — keep inline (not in Phase 1 scope):
    case 'instagram': return (
      <Field label="Kullanıcı Adı">
        <input
          type="text"
          value={(state.content as Extract<ContentData, { type: 'instagram' }>).username}
          onChange={(e) => updateContent({ username: e.target.value })}
          placeholder="@kullaniciadi"
          className="input"
        />
      </Field>
    );
    case 'google-review': return (
      <Field label="Google Yorum Linki">
        <input
          type="url"
          value={(state.content as Extract<ContentData, { type: 'google-review' }>).url}
          onChange={(e) => updateContent({ url: e.target.value })}
          placeholder="https://g.page/r/..."
          className="input"
        />
      </Field>
    );
    case 'menu': return (
      <Field label="Menü URL">
        <input
          type="url"
          value={(state.content as Extract<ContentData, { type: 'menu' }>).url}
          onChange={(e) => updateContent({ url: e.target.value })}
          placeholder="https://menu.example.com"
          className="input"
        />
      </Field>
    );
    default: return null;
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
      <div>
        {renderForm(currentType, updateContent, state)}
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
