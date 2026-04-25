'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Mail, Lock } from 'lucide-react';

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
      setError('Giriş bilgileri doğrulanamadı.');
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500" htmlFor="email">
          E-posta
        </label>
        <div className="relative">
          <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            id="email"
            name="email"
            type="email"
            required
            className="input input-icon"
            placeholder="ornek@qrbir.com"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500" htmlFor="password">
          Şifre
        </label>
        <div className="relative">
          <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="input input-icon"
            placeholder="••••••••"
          />
        </div>
      </div>

      {registered && <p className="text-sm text-emerald-600">Kayıt başarılı. Giriş yapabilirsiniz.</p>}
      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 w-full rounded-[13px] py-3 text-sm font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          background: 'linear-gradient(135deg, #C026D3, #a21caf)',
          boxShadow: '0 4px 16px rgba(192,38,211,0.3)',
        }}
      >
        {pending ? 'Giriş yapılıyor...' : 'Giriş yap'}
      </button>

      <p className="text-center text-sm text-slate-500">
        Hesabın yok mu?{' '}
        <Link href="/register" className="font-bold text-fuchsia-600 hover:text-fuchsia-700">
          Kayıt ol
        </Link>
      </p>
    </form>
  );
}
