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

// ─── Request Schema ───────────────────────────────────────────────────────────

const UpdateQrBodySchema = z.object({
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

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const record = await prisma.qrCode.findUnique({
    where: { id },
    include: { content: true, design: true },
  });

  if (!record) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (record.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(record, { status: 200 });
}

// ─── DELETE handler ───────────────────────────────────────────────────────────

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const qrCode = await prisma.qrCode.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!qrCode) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (qrCode.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.qrCode.delete({ where: { id } });

  return NextResponse.json({ success: true }, { status: 200 });
}

// ─── PUT handler ──────────────────────────────────────────────────────────────

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const qrCode = await prisma.qrCode.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!qrCode) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (qrCode.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = UpdateQrBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.qrCode.update({
    where: { id },
    data: {
      type: CONTENT_TYPE_TO_QR_TYPE[parsed.data.contentType],
      title: parsed.data.name,
      content: {
        upsert: {
          create: { payload: parsed.data.content as object },
          update: { payload: parsed.data.content as object },
        },
      },
      design: {
        upsert: {
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
          update: {
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
    },
    include: { content: true, design: true },
  });

  return NextResponse.json(updated, { status: 200 });
}
