import { LoginForm } from '@/components/auth/LoginForm';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <main className="mx-auto flex max-w-7xl px-6 py-16">
      <section className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:mx-auto lg:max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-600">
          Giriş Yap
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
          QR Platform hesabına giriş yap
        </h1>
        <LoginForm />
      </section>
    </main>
  );
}
