import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { QrCodeType } from '@prisma/client';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import {
  ContentTypeEnum,
  ContentDataSchema,
  QrStyleSchema,
  CtaConfigSchema,
} from '@/lib/core/schemas';
import type { ContentType } from '@/lib/core/schemas';
import { generateSlug } from '@/lib/qr/slug';

// ─── Request Schema ───────────────────────────────────────────────────────────

const SaveQrBodySchema = z.object({
  name: z.string().min(1).max(100),
  contentType: ContentTypeEnum,
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

// ─── ContentType → QrCodeType mapping ────────────────────────────────────────

const CONTENT_TYPE_TO_QR_TYPE: Record<ContentType, QrCodeType> = {
  url: 'URL',
  instagram: 'URL',
  'google-review': 'URL',
  menu: 'URL',
  location: 'MAP',
  phone: 'PHONE',
  email: 'EMAIL',
  whatsapp: 'WHATSAPP',
  wifi: 'WIFI',
  vcard: 'VCARD',
};

// ─── GET handler ──────────────────────────────────────────────────────────────

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const qrCodes = await prisma.qrCode.findMany({
    where: { userId: session.user.id },
    include: { content: true, design: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(qrCodes, { status: 200 });
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(request: Request) {
  // 1. Auth gate
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parse JSON body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // 3. Validate body
  const parsed = SaveQrBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // 4. Generate slug
  const slug = generateSlug();

  // 5. Persist atomically via nested create (single round-trip)
  const qrCode = await prisma.qrCode.create({
    data: {
      userId: session.user.id,
      type: CONTENT_TYPE_TO_QR_TYPE[parsed.data.contentType],
      title: parsed.data.name,
      slug,
      content: {
        create: {
          payload: parsed.data.content as object,
        },
      },
      design: {
        create: {
          shapeId: parsed.data.shapeId,
          frameId: parsed.data.frameId ?? null,
          style: {
            qrStyle: parsed.data.qrStyle,
            ctaBandColor: parsed.data.ctaBandColor ?? null,
            decorativeColor: parsed.data.decorativeColor ?? null,
            backgroundColor: parsed.data.backgroundColor,
            borderColor: parsed.data.borderColor,
            borderWidth: parsed.data.borderWidth,
            cta: parsed.data.cta,
          } as object,
        },
      },
    },
    include: { content: true, design: true },
  });

  // 6. Return created resource identifiers
  return NextResponse.json({ id: qrCode.id, slug: qrCode.slug }, { status: 201 });
}
