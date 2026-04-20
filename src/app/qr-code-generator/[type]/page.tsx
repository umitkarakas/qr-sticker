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
    <main className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10">
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
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
          {definition.status === 'ready'
            ? 'Bu tip mevcut builder ile onizlenebilir.'
            : 'Bu tip sonraki fazda ozel alanlar ve upload akisi ile tamamlanacak.'}
        </div>
      </div>

      {definition.contentType ? (
        <GeneratorWorkspace initialContentType={definition.contentType} editId={editId} />
      ) : (
        <section className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-xl font-semibold text-slate-900">Bu tip hazirlaniyor</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            `{definition.label}` icin dosya yukleme, veri modeli ve kaydetme akisi sonraki
            fazda eklenecek. Katalog ve route yapisi simdiden hazir.
          </p>
        </section>
      )}
    </main>
  );
}
