import { ATTRIBUTION } from '../../data/attribution';

export default function Marquee() {
  return (
    <nav
      className="flex h-10 items-center justify-center gap-2 overflow-hidden border-b border-crt-line/40 bg-crt-void/95 font-mono text-[12px] sm:h-11 sm:gap-0 sm:text-[13px]"
      data-testid="marquee"
      data-system="marquee"
      aria-label="Social links"
    >
      {/* Mobile: static icons, no separators */}
      <div className="flex items-center gap-3 sm:hidden">
        <a
          className="inline-flex items-center gap-1.5 px-1 py-2 text-crt-amber transition-colors hover:text-crt-ink"
          href={ATTRIBUTION.links.github}
          rel="noreferrer"
          target="_blank"
          aria-label="See project on GitHub"
        >
          <span aria-hidden="true">⌘</span>
          <span>GitHub</span>
        </a>
        <a
          className="inline-flex items-center gap-1.5 px-1 py-2 text-crt-amber transition-colors hover:text-crt-ink"
          href={ATTRIBUTION.links.twitter}
          rel="noreferrer"
          target="_blank"
          aria-label="Follow on Twitter"
        >
          <span aria-hidden="true">𝕏</span>
          <span>@prabal_</span>
        </a>
        <a
          className="inline-flex items-center gap-1.5 px-1 py-2 text-crt-amber transition-colors hover:text-crt-ink"
          href={ATTRIBUTION.links.linkedin}
          rel="noreferrer"
          target="_blank"
          aria-label="Connect on LinkedIn"
        >
          <span aria-hidden="true">in</span>
        </a>
        <a
          className="inline-flex items-center gap-1.5 px-1 py-2 text-crt-amber transition-colors hover:text-crt-ink"
          href={ATTRIBUTION.links.home}
          rel="noreferrer"
          target="_blank"
          aria-label="Visit prabal.ca"
        >
          <span aria-hidden="true">🏠</span>
        </a>
      </div>

      {/* Desktop: equidistant with dot separators */}
      <div className="hidden items-center sm:flex">
        <a
          className="inline-flex items-center gap-2 px-4 py-2 text-crt-amber transition-colors hover:text-crt-ink hover:text-glow-amber"
          data-testid="marquee-github"
          href={ATTRIBUTION.links.github}
          rel="noreferrer"
          target="_blank"
        >
          <span aria-hidden="true">⌘</span>
          <span>See on GitHub</span>
        </a>
        <span className="text-crt-ink/50">•</span>
        <a
          className="inline-flex items-center gap-2 px-4 py-2 text-crt-amber transition-colors hover:text-crt-ink hover:text-glow-amber"
          data-testid="marquee-twitter"
          href={ATTRIBUTION.links.twitter}
          rel="noreferrer"
          target="_blank"
        >
          <span aria-hidden="true">𝕏</span>
          <span>@prabal_</span>
        </a>
        <span className="text-crt-ink/50">•</span>
        <a
          className="inline-flex items-center gap-2 px-4 py-2 text-crt-amber transition-colors hover:text-crt-ink hover:text-glow-amber"
          href={ATTRIBUTION.links.linkedin}
          rel="noreferrer"
          target="_blank"
        >
          <span aria-hidden="true">in</span>
          <span>LinkedIn</span>
        </a>
        <span className="text-crt-ink/50">•</span>
        <a
          className="inline-flex items-center gap-2 px-4 py-2 text-crt-amber transition-colors hover:text-crt-ink hover:text-glow-amber"
          href={ATTRIBUTION.links.home}
          rel="noreferrer"
          target="_blank"
        >
          <span aria-hidden="true">🏠</span>
          <span>prabal.ca</span>
        </a>
      </div>
    </nav>
  );
}
