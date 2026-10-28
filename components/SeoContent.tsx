export function SeoContent() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-12 text-sm leading-relaxed text-white/70">
      <h1 className="text-2xl font-bold text-white mb-3">
        Free football lineup maker for teams
      </h1>
      <p className="mb-6">
        StartingXI helps you build a starting XI in seconds. Choose 5, 7, 8, 9
        or 11-a-side, pick a formation, add your players and download a clean
        lineup graphic for WhatsApp, Instagram and X. No design skills and no
        sign-up needed.
      </p>

      <h2 className="text-lg font-semibold text-white mb-2">How it works</h2>
      <ol className="list-decimal pl-5 mb-6 space-y-1">
        <li>Pick your format and formation, like 4-3-3, 4-4-2 or 3-5-2.</li>
        <li>Tap a position to add a player's name, shirt number and photo.</li>
        <li>
          Add your subs, choose a template and kit colours, then download the
          image.
        </li>
      </ol>

      <h2 className="text-lg font-semibold text-white mb-2">
        Built for grassroots football
      </h2>
      <p className="mb-6">
        Sunday league, school, community and tournament teams can all use it.
        Organisers can also run a league or knockout cup: register teams and
        squads, generate fixtures, enter results and let the table update
        automatically.
      </p>

      <h2 className="text-lg font-semibold text-white mb-2">Pricing</h2>
      <p className="mb-6">
        The lineup builder and the Classic template are free. Premium templates,
        animated reveal videos and larger tournaments are paid per use, priced
        in naira and shown before you pay.
      </p>

      <h2 className="text-lg font-semibold text-white mb-3">
        Frequently asked questions
      </h2>
      <div className="space-y-2">
        <details className="rounded-lg bg-white/5 px-4 py-3">
          <summary className="cursor-pointer font-medium text-white">
            Is StartingXI free?
          </summary>
          <p className="mt-2">
            Yes. Building a lineup and downloading it with the Classic template
            is free.
          </p>
        </details>
        <details className="rounded-lg bg-white/5 px-4 py-3">
          <summary className="cursor-pointer font-medium text-white">
            Which formats and formations are supported?
          </summary>
          <p className="mt-2">
            5, 7, 8, 9 and 11-a-side, with formations like 4-3-3, 4-4-2,
            4-2-3-1, 3-5-2, 3-3-2 and 2-3-2.
          </p>
        </details>
        <details className="rounded-lg bg-white/5 px-4 py-3">
          <summary className="cursor-pointer font-medium text-white">
            Can I share my lineup on WhatsApp?
          </summary>
          <p className="mt-2">
            Yes. Download the lineup as an image and post it to WhatsApp,
            Instagram or X.
          </p>
        </details>
      </div>
    </section>
  );
}
