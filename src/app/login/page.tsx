import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { LoginForm } from '@/components/auth/LoginForm';
import { authOptions } from '@/lib/auth/options';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <main className="mx-auto flex max-w-7xl px-6 py-16">
      <section className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:mx-auto lg:max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-600">
          Login
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
          QR Platform hesabina giris yap
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Credentials tabanli ilk auth akisi aktif. Sonraki adimda dashboard ve QR CRUD bu
          session modeliyle korunacak.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
