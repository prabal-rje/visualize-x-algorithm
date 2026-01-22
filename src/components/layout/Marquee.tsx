import { Home, Github, Twitter, Linkedin } from 'lucide-react';
import { ATTRIBUTION } from '../../data/attribution';

export default function Marquee() {
  return (
    <nav
      className="flex h-10 items-center justify-center gap-2 overflow-hidden bg-crt-void/95 font-mono text-[12px] sm:h-11 sm:gap-0 sm:text-[13px]"
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
          <Github size={14} aria-hidden="true" />
          <span>GitHub</span>
        </a>
        <a
          className="inline-flex items-center gap-1.5 px-1 py-2 text-crt-amber transition-colors hover:text-crt-ink"
          href={ATTRIBUTION.links.twitter}
          rel="noreferrer"
          target="_blank"
          aria-label="Follow on Twitter"
        >
          <Twitter size={14} aria-hidden="true" />
          <span>@prabal_</span>
        </a>
        <a
          className="inline-flex items-center gap-1.5 px-1 py-2 text-crt-amber transition-colors hover:text-crt-ink"
          href={ATTRIBUTION.links.linkedin}
          rel="noreferrer"
          target="_blank"
          aria-label="Connect on LinkedIn"
        >
          <Linkedin size={14} aria-hidden="true" />
        </a>
        <a
          className="inline-flex items-center gap-1.5 px-1 py-2 text-crt-amber transition-colors hover:text-crt-ink"
          href={ATTRIBUTION.links.home}
          rel="noreferrer"
          target="_blank"
          aria-label="Visit prabal.ca"
        >
          <Home size={14} aria-hidden="true" />
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
          <Github size={16} aria-hidden="true" />
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
          <Twitter size={16} aria-hidden="true" />
          <span>@prabal_</span>
        </a>
        <span className="text-crt-ink/50">•</span>
        <a
          className="inline-flex items-center gap-2 px-4 py-2 text-crt-amber transition-colors hover:text-crt-ink hover:text-glow-amber"
          href={ATTRIBUTION.links.linkedin}
          rel="noreferrer"
          target="_blank"
        >
          <Linkedin size={16} aria-hidden="true" />
          <span>LinkedIn</span>
        </a>
        <span className="text-crt-ink/50">•</span>
        <a
          className="inline-flex items-center gap-2 px-4 py-2 text-crt-amber transition-colors hover:text-crt-ink hover:text-glow-amber"
          href={ATTRIBUTION.links.home}
          rel="noreferrer"
          target="_blank"
        >
          <Home size={16} aria-hidden="true" />
          <span>prabal.ca</span>
        </a>
      </div>
    </nav>
  );
}
