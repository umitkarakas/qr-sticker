'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const registered = searchParams.get('registered') === '1';

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError('');

    const result = await signIn('credentials', {
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? ''),
      redirect: false,
    });

    setPending(false);

    if (!result || result.error) {
      setError('Giris bilgileri dogrulanamadi.');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="mt-8 space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="input"
          placeholder="ornek@qrbir.com"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="password">
          Sifre
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="input"
          placeholder="********"
        />
      </div>

      {registered ? <p className="text-sm text-emerald-600">Kayit basarili. Giris yapabilirsiniz.</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-fuchsia-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Giris yapiliyor...' : 'Giris yap'}
      </button>

      <p className="text-sm text-slate-500">
        Hesabin yok mu?{' '}
        <Link href="/register" className="font-medium text-fuchsia-600 hover:text-fuchsia-700">
          Kayit ol
        </Link>
      </p>
    </form>
  );
}
