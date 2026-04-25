'use client';

import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';
import { DEFAULT_AUTH_ACTION_STATE, registerAction } from '@/lib/auth/actions';

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(registerAction, DEFAULT_AUTH_ACTION_STATE);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    if (state.success) {
      router.push('/login?registered=1');
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <form action={formAction} className="space-y-4">
      {/* Hidden combined name field consumed by registerAction */}
      <input type="hidden" name="name" value={`${firstName} ${lastName}`.trim()} />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Ad</label>
          <input
            type="text"
            placeholder="Ali"
            required
            className="input"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">Soyad</label>
          <input
            type="text"
            placeholder="Yılmaz"
            required
            className="input"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
      </div>

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
            placeholder="En az 8 karakter"
          />
        </div>
      </div>

      {state.message && (
        <p className={`text-sm ${state.success ? 'text-emerald-600' : 'text-rose-600'}`}>{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 w-full rounded-[13px] py-3 text-sm font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          background: 'linear-gradient(135deg, #C026D3, #a21caf)',
          boxShadow: '0 4px 16px rgba(192,38,211,0.3)',
        }}
      >
        {pending ? 'Kaydediliyor...' : 'Hesap oluştur'}
      </button>

      <p className="text-center text-sm text-slate-500">
        Hesabın var mı?{' '}
        <Link href="/login" className="font-bold text-fuchsia-600 hover:text-fuchsia-700">
          Giriş yap
        </Link>
      </p>
    </form>
  );
}
