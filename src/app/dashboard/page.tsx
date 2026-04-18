import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { LogoutButton } from '@/components/auth/LogoutButton';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-600">
              Dashboard
            </p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
              Hos geldin, {session.user.name ?? session.user.email}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Auth katmani artik aktif. Siradaki adimda bu yuzeye kayitli QR listesi,
              filtreleme ve duzenleme akisi eklenecek.
            </p>
          </div>

          <LogoutButton />
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Kullanici ID</p>
            <p className="mt-2 break-all text-sm text-slate-800">{session.user.id}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Rol</p>
            <p className="mt-2 text-sm text-slate-800">{session.user.role ?? 'USER'}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-500">Sonraki Adim</p>
            <Link href="/qr-code-generator" className="mt-2 inline-block text-sm font-semibold text-fuchsia-600">
              Ilk QR’i olustur
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
