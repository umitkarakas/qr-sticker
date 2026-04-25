import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GeneratorWorkspace } from '@/components/GeneratorWorkspace';
import { getQrTypeDefinition } from '@/lib/qr-types/registry';

export default async function QrTypePage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const { type } = await params;
  const { edit: editId } = await searchParams;
  const definition = getQrTypeDefinition(type);

  if (!definition) {
    notFound();
  }

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(ellipse at 10% 20%, rgba(32,164,219,0.15) 0%, transparent 55%), radial-gradient(ellipse at 90% 85%, rgba(76,187,194,0.15) 0%, transparent 50%), radial-gradient(ellipse at 60% 5%, rgba(192,38,211,0.07) 0%, transparent 45%), #eef4fb',
      }}
    >
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <Link href="/qr-code-generator" className="text-sm font-medium text-fuchsia-600 hover:text-fuchsia-700">
            Geri don
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            {definition.label}
          </h1>
          <p className="text-base text-slate-600">{definition.shortDescription}</p>
        </div>
        <div
          className="rounded-2xl px-4 py-3 text-sm text-slate-500"
          style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.9)' }}
        >
          {definition.status === 'ready'
            ? 'Bu tip mevcut builder ile onizlenebilir.'
            : 'Bu tip sonraki fazda ozel alanlar ve upload akisi ile tamamlanacak.'}
        </div>
      </div>

      {definition.contentType ? (
        <GeneratorWorkspace initialContentType={definition.contentType} editId={editId} />
      ) : (
        <section
          className="rounded-3xl p-10 text-center"
          style={{ background: 'rgba(255,255,255,0.5)', border: '1px dashed rgba(148,163,184,0.5)' }}
        >
          <h2 className="text-xl font-semibold text-slate-900">Bu tip hazirlaniyor</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            `{definition.label}` icin dosya yukleme, veri modeli ve kaydetme akisi sonraki
            fazda eklenecek. Katalog ve route yapisi simdiden hazir.
          </p>
        </section>
      )}
    </div>
    </main>
  );
}
