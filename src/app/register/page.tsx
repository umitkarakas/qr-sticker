import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { authOptions } from '@/lib/auth/options';

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect('/dashboard');
  }

  return (
    <main className="mx-auto flex max-w-7xl px-6 py-16">
      <section className="w-full rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:mx-auto lg:max-w-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-fuchsia-600">
          Register
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
          Yeni QR Platform hesabi olustur
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          V1 icin basit credentials akisi yeterli. Coolify altindaki ilk deploydan sonra admin
          kullanici da bu yuzeyden acilabilecek.
        </p>
        <RegisterForm />
      </section>
    </main>
  );
}
