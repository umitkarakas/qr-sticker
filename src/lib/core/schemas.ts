import { z } from 'zod';

// ─── Content Types ───

export const ContentTypeEnum = z.enum([
  'url', 'instagram', 'whatsapp', 'wifi', 'vcard',
  'google-review', 'menu', 'phone', 'email', 'location',
]);
export type ContentType = z.infer<typeof ContentTypeEnum>;

// Discriminated union for content data - each type has its own fields
export const ContentDataSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('url'), url: z.string().url() }),
  z.object({ type: z.literal('instagram'), username: z.string().min(1) }),
  z.object({ type: z.literal('whatsapp'), phone: z.string().min(1), message: z.string().optional() }),
  z.object({
    type: z.literal('wifi'),
    ssid: z.string().min(1),
    password: z.string(),
    encryption: z.enum(['WPA', 'WEP', 'nopass']).default('WPA'),
  }),
  z.object({
    type: z.literal('vcard'),
    firstName: z.string().min(1),
    lastName: z.string().default(''),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    org: z.string().optional(),
    title: z.string().optional(),
  }),
  z.object({ type: z.literal('google-review'), url: z.string().url() }),
  z.object({ type: z.literal('menu'), url: z.string().url() }),
  z.object({ type: z.literal('phone'), phone: z.string().min(1) }),
  z.object({
    type: z.literal('email'),
    email: z.string().email(),
    subject: z.string().optional(),
    body: z.string().optional(),
  }),
  z.object({ type: z.literal('location'), url: z.string().url() }),
]);
export type ContentData = z.infer<typeof ContentDataSchema>;

// ─── QR Style ───

export const DotTypeEnum = z.enum(['square', 'rounded', 'classy', 'classy-rounded', 'extra-rounded', 'dots']);
export type DotType = z.infer<typeof DotTypeEnum>;

export const CornerSquareTypeEnum = z.enum(['square', 'extra-rounded', 'dot']);
export type CornerSquareType = z.infer<typeof CornerSquareTypeEnum>;

export const CornerDotTypeEnum = z.enum(['square', 'dot']);
export type CornerDotType = z.infer<typeof CornerDotTypeEnum>;

export const ErrorCorrectionEnum = z.enum(['L', 'M', 'Q', 'H']);
export type ErrorCorrection = z.infer<typeof ErrorCorrectionEnum>;

export const GradientSchema = z.object({
  type: z.enum(['linear', 'radial']),
  rotation: z.number().default(0),
  colorStops: z.array(z.object({
    offset: z.number().min(0).max(1),
    color: z.string(),
  })).min(2),
});
export type Gradient = z.infer<typeof GradientSchema>;

export const QrStyleSchema = z.object({
  dotType: DotTypeEnum.default('rounded'),
  dotColor: z.string().default('#000000'),
  dotGradient: GradientSchema.optional(),
  cornerSquareType: CornerSquareTypeEnum.default('extra-rounded'),
  cornerSquareColor: z.string().optional(),
  cornerDotType: CornerDotTypeEnum.default('dot'),
  cornerDotColor: z.string().optional(),
  backgroundColor: z.string().default('transparent'),
  errorCorrection: ErrorCorrectionEnum.default('M'),
  logo: z.object({
    dataUrl: z.string(),
    size: z.number().min(0.1).max(0.5).default(0.3),
    margin: z.number().default(5),
  }).optional(),
});
export type QrStyle = z.infer<typeof QrStyleSchema>;

// ─── CTA Config ───

export const CtaConfigSchema = z.object({
  text: z.string().default(''),
  iconName: z.string().optional(),
  fontSize: z.number().min(8).max(32).default(14),
  fontWeight: z.number().default(600),
  color: z.string().default('#333333'),
  backgroundColor: z.string().optional(),
});
export type CtaConfig = z.infer<typeof CtaConfigSchema>;

// ─── Full Designer State ───

export const DesignerStateSchema = z.object({
  content: ContentDataSchema,
  qrStyle: QrStyleSchema,
  shapeId: z.string().default('rounded-rect'),
  frameId: z.string().optional(),
  ctaBandColor: z.string().optional(),
  decorativeColor: z.string().optional(),
  backgroundColor: z.string().default('#FFFFFF'),
  borderColor: z.string().default('#000000'),
  borderWidth: z.number().min(0).max(10).default(0),
  cta: CtaConfigSchema,
});
export type DesignerState = z.infer<typeof DesignerStateSchema>;

// ─── Default State ───

export const DEFAULT_DESIGNER_STATE: DesignerState = {
  content: { type: 'url', url: 'https://example.com' },
  qrStyle: {
    dotType: 'rounded',
    dotColor: '#000000',
    cornerSquareType: 'extra-rounded',
    cornerDotType: 'dot',
    backgroundColor: 'transparent',
    errorCorrection: 'M',
  },
  shapeId: 'rounded-rect',
  frameId: undefined,
  ctaBandColor: undefined,
  decorativeColor: undefined,
  backgroundColor: '#FFFFFF',
  borderColor: '#000000',
  borderWidth: 0,
  cta: {
    text: 'Ziyaret edin',
    fontSize: 14,
    fontWeight: 600,
    color: '#333333',
  },
};
