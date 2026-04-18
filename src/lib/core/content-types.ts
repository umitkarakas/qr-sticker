import type { ContentData, ContentType } from './schemas';
import type { DesignerState } from './schemas';
import { DEFAULT_DESIGNER_STATE } from './schemas';

export interface ContentTypeConfig {
  type: ContentType;
  label: string;
  defaultCta: string;
  iconName: string;
  formatQrData: (data: ContentData) => string;
}

function formatWifi(data: Extract<ContentData, { type: 'wifi' }>): string {
  const esc = (s: string) => s.replace(/[\\;,:""]/g, '\\$&');
  return `WIFI:T:${data.encryption};S:${esc(data.ssid)};P:${esc(data.password)};;`;
}

function formatVcard(data: Extract<ContentData, { type: 'vcard' }>): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${data.lastName};${data.firstName}`,
    `FN:${data.firstName} ${data.lastName}`.trim(),
  ];
  if (data.phone) lines.push(`TEL:${data.phone}`);
  if (data.email) lines.push(`EMAIL:${data.email}`);
  if (data.org) lines.push(`ORG:${data.org}`);
  if (data.title) lines.push(`TITLE:${data.title}`);
  lines.push('END:VCARD');
  return lines.join('\n');
}

function formatEmail(data: Extract<ContentData, { type: 'email' }>): string {
  const params = new URLSearchParams();
  if (data.subject) params.set('subject', data.subject);
  if (data.body) params.set('body', data.body);
  const qs = params.toString();
  return `mailto:${data.email}${qs ? '?' + qs : ''}`;
}

function formatQrData(data: ContentData): string {
  switch (data.type) {
    case 'url': return data.url;
    case 'instagram': return `https://instagram.com/${data.username.replace(/^@/, '')}`;
    case 'whatsapp': {
      const phone = data.phone.replace(/[^0-9+]/g, '');
      const url = `https://wa.me/${phone.replace('+', '')}`;
      return data.message ? `${url}?text=${encodeURIComponent(data.message)}` : url;
    }
    case 'wifi': return formatWifi(data);
    case 'vcard': return formatVcard(data);
    case 'google-review': return data.url;
    case 'menu': return data.url;
    case 'phone': return `tel:${data.phone}`;
    case 'email': return formatEmail(data);
    case 'location': return data.url;
  }
}

export function getDefaultContent(type: ContentType): ContentData {
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

export const CONTENT_TYPES: Record<ContentType, ContentTypeConfig> = {
  url: {
    type: 'url',
    label: 'Web Sitesi',
    defaultCta: 'Ziyaret edin',
    iconName: 'Globe',
    formatQrData,
  },
  instagram: {
    type: 'instagram',
    label: 'Instagram',
    defaultCta: 'Bizi takip edin',
    iconName: 'Instagram',
    formatQrData,
  },
  whatsapp: {
    type: 'whatsapp',
    label: 'WhatsApp',
    defaultCta: 'Bize yazın',
    iconName: 'MessageCircle',
    formatQrData,
  },
  wifi: {
    type: 'wifi',
    label: 'WiFi',
    defaultCta: "WiFi'a bağlanın",
    iconName: 'Wifi',
    formatQrData,
  },
  vcard: {
    type: 'vcard',
    label: 'Kartvizit',
    defaultCta: 'Rehbere ekleyin',
    iconName: 'UserPlus',
    formatQrData,
  },
  'google-review': {
    type: 'google-review',
    label: 'Google Yorum',
    defaultCta: 'Bizi değerlendirin',
    iconName: 'Star',
    formatQrData,
  },
  menu: {
    type: 'menu',
    label: 'Menü',
    defaultCta: 'Menüyü görün',
    iconName: 'UtensilsCrossed',
    formatQrData,
  },
  phone: {
    type: 'phone',
    label: 'Telefon',
    defaultCta: 'Bizi arayın',
    iconName: 'Phone',
    formatQrData,
  },
  email: {
    type: 'email',
    label: 'E-posta',
    defaultCta: 'E-posta gönderin',
    iconName: 'Mail',
    formatQrData,
  },
  location: {
    type: 'location',
    label: 'Konum',
    defaultCta: 'Bizi bulun',
    iconName: 'MapPin',
    formatQrData,
  },
};

export function getContentTypeConfig(type: ContentType): ContentTypeConfig {
  return CONTENT_TYPES[type];
}

export function getQrDataString(data: ContentData): string {
  return formatQrData(data);
}

export function getDefaultContentTypeState(type: ContentType): DesignerState {
  return {
    ...DEFAULT_DESIGNER_STATE,
    content: getDefaultContent(type),
    cta: {
      ...DEFAULT_DESIGNER_STATE.cta,
      text: CONTENT_TYPES[type].defaultCta,
    },
  };
}
