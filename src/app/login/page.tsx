import Image from 'next/image';
import { LoginForm } from '@/components/auth/LoginForm';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-6 py-12"
      style={{
        background:
          'radial-gradient(ellipse at 15% 25%, rgba(32,164,219,0.18) 0%, transparent 55%), radial-gradient(ellipse at 85% 80%, rgba(76,187,194,0.18) 0%, transparent 55%), radial-gradient(ellipse at 55% 5%, rgba(192,38,211,0.1) 0%, transparent 45%), #eef4fb',
      }}
    >
      <div className="w-full max-w-sm">
        <div className="mb-7 text-center">
          <Image src="/logo.svg" alt="QRBir" width={120} height={48} priority className="mx-auto h-10 w-auto mb-5" />
          <h1 className="text-2xl font-bold tracking-tight text-brand-navy">Hoş geldiniz</h1>
          <p className="mt-1.5 text-sm text-slate-500">Hesabınıza giriş yapın</p>
        </div>

        <div
          className="rounded-3xl p-7"
          style={{
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.9)',
            boxShadow: '0 8px 32px rgba(32,80,140,0.1), inset 0 1px 0 rgba(255,255,255,0.95)',
          }}
        >
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
