import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { FORMATION_GUIDES } from "@/lib/seo/formation";

export function generateStaticParams() {
  return FORMATION_GUIDES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = FORMATION_GUIDES.find((f) => f.slug === slug);
  if (!guide) return {};
  return {
    title: `${guide.name} Formation: Roles, Strengths and Free Lineup Maker`,
    description: `How the ${guide.name} formation works, who plays where, and when to use it. Build your ${guide.name} lineup free and download it as an image.`,
    alternates: { canonical: `/formations/${guide.slug}` },
  };
}

export default async function FormationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = FORMATION_GUIDES.find((f) => f.slug === slug);
  if (!guide) notFound();

  return (
    <main className="min-h-screen text-white px-4 py-12">
      <article className="max-w-2xl mx-auto text-sm leading-relaxed text-white/70">
        <h1 className="text-3xl font-bold text-white mb-3">
          {guide.name} formation explained
        </h1>
        <p className="mb-6">{guide.intro}</p>

        <Link
          href={`/?formation=${guide.name}&size=${guide.formatSize}`}
          className="inline-block bg-[#3CEFA1] text-[#0E2F21] font-bold rounded-lg px-5 py-3 mb-10"
        >
          Build a {guide.name} lineup
        </Link>

        <h2 className="text-xl font-semibold text-white mb-2">The shape</h2>
        <p className="mb-6">{guide.shape}</p>

        <h2 className="text-xl font-semibold text-white mb-2">Key roles</h2>
        <ul className="mb-6 space-y-2">
          {guide.roles.map((r) => (
            <li key={r.position}>
              <strong className="text-white">{r.position}:</strong> {r.job}
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold text-white mb-2">Strengths</h2>
        <ul className="list-disc pl-5 mb-6 space-y-1">
          {guide.strengths.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold text-white mb-2">Weaknesses</h2>
        <ul className="list-disc pl-5 mb-6 space-y-1">
          {guide.weaknesses.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold text-white mb-2">Best for</h2>
        <p className="mb-10">{guide.bestFor}</p>

        <h2 className="text-lg font-semibold text-white mb-2">
          Other formations
        </h2>
        <ul className="flex flex-wrap gap-2">
          {FORMATION_GUIDES.filter((f) => f.slug !== guide.slug).map((f) => (
            <li key={f.slug}>
              <Link
                href={`/formations/${f.slug}`}
                className="rounded-full border border-white/15 px-3 py-1 hover:border-[#3CEFA1] hover:text-[#3CEFA1]"
              >
                {f.name}
              </Link>
            </li>
          ))}
        </ul>
      </article>
    </main>
  );
}
