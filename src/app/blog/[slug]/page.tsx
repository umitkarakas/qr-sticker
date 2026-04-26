import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BLOG_POSTS, getPostBySlug, getAllSlugs } from '@/content/blog';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — QRBir`,
    description: post.description,
    keywords: post.keywords.join(', '),
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  const idx = allPosts.findIndex((p) => p.slug === slug);
  const prev = allPosts[idx + 1] ?? null;
  const next = allPosts[idx - 1] ?? null;

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(ellipse at 15% 25%, rgba(32,164,219,0.12) 0%, transparent 60%), radial-gradient(ellipse at 85% 75%, rgba(76,187,194,0.10) 0%, transparent 55%) #eef4fb',
      }}
    >
      <div className="mx-auto max-w-2xl px-6 py-16">
        {/* Back */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-brand-blue transition-colors"
        >
          <ArrowLeft size={14} />
          Tüm yazılar
        </Link>

        {/* Article */}
        <article className="rounded-2xl border border-white/80 bg-white/60 p-8 shadow-sm backdrop-blur-md">
          <p className="text-xs text-slate-400 mb-3">
            {new Date(post.publishedAt).toLocaleDateString('tr-TR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <h1 className="text-2xl font-bold leading-snug tracking-tight text-brand-navy md:text-3xl">
            {post.title}
          </h1>
          <p className="mt-3 text-base text-slate-500 leading-relaxed">{post.description}</p>

          {post.keywords.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.keywords.map((kw) => (
                <span
                  key={kw}
                  className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}

          <hr className="my-6 border-slate-100" />

          {/* HTML content */}
          <div
            className="prose prose-slate prose-sm max-w-none prose-headings:font-bold prose-headings:text-brand-navy prose-a:text-brand-blue"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>

        {/* CTA */}
        <div className="mt-6 rounded-2xl border border-brand-blue/20 bg-brand-blue/6 p-6 text-center">
          <p className="text-sm font-semibold text-brand-navy">
            Hemen ücretsiz QR kodunuzu oluşturun
          </p>
          <p className="mt-1 text-xs text-slate-500">Kayıt gerektirmez, saniyeler içinde hazır.</p>
          <Link
            href="/qr-code-generator"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand-blue/20 transition hover:bg-[#1a93c5]"
          >
            QR Oluştur
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Prev / Next */}
        {(prev || next) && (
          <div className="mt-6 flex gap-3">
            {prev && (
              <Link
                href={`/blog/${prev.slug}`}
                className="flex-1 rounded-xl border border-white/80 bg-white/60 p-4 text-sm backdrop-blur-md transition hover:bg-white/80"
              >
                <p className="text-xs text-slate-400 mb-1">← Önceki</p>
                <p className="font-medium text-brand-navy line-clamp-2">{prev.title}</p>
              </Link>
            )}
            {next && (
              <Link
                href={`/blog/${next.slug}`}
                className="flex-1 rounded-xl border border-white/80 bg-white/60 p-4 text-sm text-right backdrop-blur-md transition hover:bg-white/80"
              >
                <p className="text-xs text-slate-400 mb-1">Sonraki →</p>
                <p className="font-medium text-brand-navy line-clamp-2">{next.title}</p>
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
