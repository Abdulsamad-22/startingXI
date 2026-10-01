export function FeedbackSupport({
  xUrl = "https://x.com/_Hoossayn",
  instagramUrl = "https://www.instagram.com/hoosayn_10?igsh=MWQzNDRlaHVnaTJqOA==",
  feedbackEmail = "hello@yourapp.com",
}: {
  xUrl?: string;
  instagramUrl?: string;
  feedbackEmail?: string;
}) {
  return (
    <div className="mt-10 border-t border-white/10 pt-6 pb-4 px-4 flex flex-col items-center gap-3 text-center">
      <p className="text-xs text-white/80 uppercase tracking-wide">
        Got a shout / an issue from the sideline?
      </p>
      {/* <p className="text-sm text-white/70 max-w-xs">
        Found a bug, got an idea, or just want to say what's up — we're
        listening.
      </p> */}

      {/* <a
        href={`mailto:${feedbackEmail}`}
        className="text-xs font-semibold text-[#3CEFA1] hover:underline"
      >
        {feedbackEmail}
      </a> */}

      <div className="flex items-center gap-3 mt-1">
        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow us on X"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-white/15 text-white/60 hover:text-[#3CEFA1] hover:border-[#3CEFA1]/50 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>

        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow us on Instagram"
          className="w-9 h-9 flex items-center justify-center rounded-full border border-white/15 text-white/60 hover:text-[#3CEFA1] hover:border-[#3CEFA1]/50 transition-colors"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle
              cx="17.5"
              cy="6.5"
              r="1"
              fill="currentColor"
              stroke="none"
            />
          </svg>
        </a>
      </div>

      <p className="text-[12px] text-white/50 mt-2">
        Built for the grassroots.
      </p>
    </div>
  );
}
