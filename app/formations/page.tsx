import Link from "next/link";
import type { Metadata } from "next";
import { FORMATION_GUIDES } from "@/lib/seo/formation";

export const metadata: Metadata = {
  title: "Football Formations Explained (5 to 11-a-side)",
  description:
    "Guides to every football formation from 5-a-side to 11-a-side: the shape, key roles, strengths and weaknesses. Pick one and build your lineup free.",
  alternates: { canonical: "/formations" },
};

const FORMAT_ORDER = [11, 9, 8, 7, 5];

const FORMAT_BLURB: Record<number, string> = {
  11: "The full game. These are the shapes you will see from Sunday league to the professional level.",
  9: "A smaller-pitch format with room for a back three and a front three.",
  8: "Enough players for three lines without crowding a smaller pitch.",
  7: "Tight and fast. Every player touches the ball often, so each role matters.",
  5: "Small-sided football where everyone attacks and defends.",
};

function firstSentence(text: string) {
  const i = text.indexOf(". ");
  return i === -1 ? text : text.slice(0, i + 1);
}

export default function FormationsHubPage() {
  return (
    <main className="min-h-screen text-white px-4 py-12">
      <div className="max-w-3xl mx-auto text-sm leading-relaxed text-white/70">
        <h1 className="text-3xl font-bold text-white mb-3">
          Football formations explained
        </h1>
        <p className="mb-4">
          A formation is how you arrange your players on the pitch, written as
          the number of defenders, midfielders and forwards. Each guide below
          covers the shape, what every position is responsible for, and where
          the formation is strong or weak. Every guide also has a button that
          opens that formation in the lineup builder, so you can set up your
          team and download the image.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#3CEFA1] text-[#0E2F21] font-bold rounded-lg px-5 py-3 mb-12"
        >
          Open the lineup builder
        </Link>

        {FORMAT_ORDER.map((size) => {
          const guides = FORMATION_GUIDES.filter((g) => g.formatSize === size);
          if (guides.length === 0) return null;
          return (
            <section key={size} className="mb-12">
              <h2 className="text-xl font-semibold text-white mb-1">
                {size}-a-side formations
              </h2>
              <p className="mb-4">{FORMAT_BLURB[size]}</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {guides.map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={`/formations/${g.slug}`}
                      className="block h-full rounded-xl bg-[#343A38] border border-white/10 p-4 hover:border-[#3CEFA1]/60 transition-colors"
                    >
                      <span className="block text-lg font-bold text-white mb-1">
                        {g.name}
                      </span>
                      <span className="block text-white/60">
                        {firstSentence(g.intro)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">
            How to choose a formation
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-white">Start with your players.</strong>{" "}
              Pick the shape that fits your best players, not the one you saw on
              television. Two good strikers suggest a 4-4-2, and a strong
              holding midfielder suggests a 4-1-4-1.
            </li>
            <li>
              <strong className="text-white">Check your fitness.</strong>{" "}
              Wing-back formations such as 3-5-2 and 3-4-3 ask a lot of the wide
              players over a full game.
            </li>
            <li>
              <strong className="text-white">
                Think about the opposition.
              </strong>{" "}
              A compact shape like 5-4-1 helps against a stronger side. A
              front-foot shape like 4-3-3 suits a team that wants the ball.
            </li>
            <li>
              <strong className="text-white">Keep it simple.</strong> With
              limited training time, the formation your players understand will
              beat a clever one they do not.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
