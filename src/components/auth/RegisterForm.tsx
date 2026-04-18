'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DEFAULT_AUTH_ACTION_STATE, registerAction } from '@/lib/auth/actions';

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(registerAction, DEFAULT_AUTH_ACTION_STATE);

  useEffect(() => {
    if (state.success) {
      router.push('/login?registered=1');
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="name">
          Ad Soyad
        </label>
        <input id="name" name="name" type="text" required className="input" placeholder="Umit Karakas" />
      </div>

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
          placeholder="En az 8 karakter"
        />
      </div>

      {state.message ? (
        <p className={`text-sm ${state.success ? 'text-emerald-600' : 'text-rose-600'}`}>
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-fuchsia-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Kayit olusturuluyor...' : 'Kayit ol'}
      </button>

      <p className="text-sm text-slate-500">
        Hesabin var mi?{' '}
        <Link href="/login" className="font-medium text-fuchsia-600 hover:text-fuchsia-700">
          Giris yap
        </Link>
      </p>
    </form>
  );
}
