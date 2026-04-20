import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { generateSlug } from '@/lib/qr/slug';

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const source = await prisma.qrCode.findUnique({
    where: { id },
    include: { content: true, design: true },
  });

  if (!source) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (source.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const slug = generateSlug();

  const duplicate = await prisma.qrCode.create({
    data: {
      userId: session.user.id,
      type: source.type,
      title: `${source.title} (copy)`,
      slug,
      content: source.content
        ? { create: { payload: source.content.payload as object } }
        : undefined,
      design: source.design
        ? {
            create: {
              shapeId: source.design.shapeId,
              frameId: source.design.frameId,
              style: source.design.style as object,
            },
          }
        : undefined,
    },
    include: { content: true, design: true },
  });

  return NextResponse.json(duplicate, { status: 201 });
}
