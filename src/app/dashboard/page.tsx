import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { prisma } from '@/lib/db/prisma';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { QrGrid } from '@/components/dashboard/QrGrid';
import type { QrCardData } from '@/components/dashboard/QrCard';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }

  const qrCodes = await prisma.qrCode.findMany({
    where: { userId: session.user.id },
    include: { content: true, design: true },
    orderBy: { createdAt: 'desc' },
  });

  const serialized: QrCardData[] = qrCodes.map((qr) => ({
    id: qr.id,
    type: qr.type,
    title: qr.title,
    createdAt: qr.createdAt.toISOString(),
    content: qr.content ? { payload: qr.content.payload } : null,
    design: qr.design
      ? {
          shapeId: qr.design.shapeId,
          frameId: qr.design.frameId,
          style: qr.design.style as Record<string, unknown>,
        }
      : null,
  }));

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-600">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              QR Kodlarım
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/qr-code-generator"
              className="rounded-xl bg-fuchsia-600 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-700 transition-colors"
            >
              + Yeni QR Oluştur
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* Grid */}
        <QrGrid initialQrCodes={serialized} />
      </div>
    </main>
  );
}
