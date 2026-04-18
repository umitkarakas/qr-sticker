import {
  Globe,
  MessageSquareText,
  Phone,
  Mail,
  MessageCircle,
  Wifi,
  UserRound,
  MapPin,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ContentType } from '@/lib/core/schemas';

export type GeneratorRouteType =
  | 'url'
  | 'text'
  | 'phone'
  | 'email'
  | 'whatsapp'
  | 'wifi'
  | 'vcard'
  | 'map'
  | 'pdf'
  | 'image';

export interface QrTypeDefinition {
  routeType: GeneratorRouteType;
  contentType?: ContentType;
  label: string;
  shortDescription: string;
  icon: LucideIcon;
  status: 'ready' | 'planned';
}

export const QR_TYPE_REGISTRY: QrTypeDefinition[] = [
  {
    routeType: 'url',
    contentType: 'url',
    label: 'URL / Link',
    shortDescription: 'Web sitesi, kampanya veya landing page yönlendirmesi.',
    icon: Globe,
    status: 'ready',
  },
  {
    routeType: 'text',
    label: 'Text',
    shortDescription: 'Serbest metin veya kısa açıklama QR akışı.',
    icon: MessageSquareText,
    status: 'planned',
  },
  {
    routeType: 'phone',
    contentType: 'phone',
    label: 'Phone Call',
    shortDescription: 'Tek dokunuşla arama başlatan QR tipi.',
    icon: Phone,
    status: 'ready',
  },
  {
    routeType: 'email',
    contentType: 'email',
    label: 'E-mail',
    shortDescription: 'Önceden doldurulmuş e-posta akışı.',
    icon: Mail,
    status: 'ready',
  },
  {
    routeType: 'whatsapp',
    contentType: 'whatsapp',
    label: 'WhatsApp',
    shortDescription: 'Mesaj veya sohbet başlatan QR tipi.',
    icon: MessageCircle,
    status: 'ready',
  },
  {
    routeType: 'wifi',
    contentType: 'wifi',
    label: 'Wi-Fi',
    shortDescription: 'SSID ve şifre ile hızlı ağ bağlantısı.',
    icon: Wifi,
    status: 'ready',
  },
  {
    routeType: 'vcard',
    contentType: 'vcard',
    label: 'vCard',
    shortDescription: 'Kişi bilgilerini rehbere kaydetme akışı.',
    icon: UserRound,
    status: 'ready',
  },
  {
    routeType: 'map',
    contentType: 'location',
    label: 'Map',
    shortDescription: 'Konum ve rota paylaşımı için QR akışı.',
    icon: MapPin,
    status: 'ready',
  },
  {
    routeType: 'pdf',
    label: 'PDF',
    shortDescription: 'Yüklü PDF dosyasına yönlendirme.',
    icon: FileText,
    status: 'planned',
  },
  {
    routeType: 'image',
    label: 'Image',
    shortDescription: 'Görsel veya galeri yönlendirmesi.',
    icon: ImageIcon,
    status: 'planned',
  },
];

export function getQrTypeDefinition(routeType: string): QrTypeDefinition | undefined {
  return QR_TYPE_REGISTRY.find((item) => item.routeType === routeType);
}
