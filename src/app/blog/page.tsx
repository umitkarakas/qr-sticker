import Link from 'next/link';
import type { Metadata } from 'next';
import { BLOG_POSTS } from '@/content/blog';
import { ArrowRight, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog — QRBir',
  description: 'QR kod kullanımı, dijital menü ve işletmeler için QR çözümleri hakkında rehberler.',
};

export default function BlogPage() {
  const posts = [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(ellipse at 15% 25%, rgba(32,164,219,0.12) 0%, transparent 60%), radial-gradient(ellipse at 85% 75%, rgba(76,187,194,0.10) 0%, transparent 55%) #eef4fb',
      }}
    >
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-blue/20 bg-brand-blue/8 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-blue">
            <BookOpen size={12} />
            Blog
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-brand-navy md:text-4xl">
            QR Rehberleri ve İpuçları
          </h1>
          <p className="mt-3 text-base text-slate-500">
            İşletmeniz için QR kodları nasıl kullanacağınızı öğrenin.
          </p>
        </div>

        {/* Post list */}
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl border border-white/80 bg-white/60 p-6 shadow-sm backdrop-blur-md transition hover:shadow-md hover:bg-white/75"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400 mb-2">
                    {new Date(post.publishedAt).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <h2 className="text-base font-bold text-brand-navy group-hover:text-brand-blue transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">
                    {post.description}
                  </p>
                  {post.keywords.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {post.keywords.slice(0, 3).map((kw) => (
                        <span
                          key={kw}
                          className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-500"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <ArrowRight
                  size={18}
                  className="mt-1 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-blue"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
