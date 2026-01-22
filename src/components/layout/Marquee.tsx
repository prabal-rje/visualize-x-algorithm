import { ATTRIBUTION } from '../../data/attribution';

export default function Marquee() {
  const content = (
    <>
      <a
        className="inline-flex min-h-[44px] items-center px-2 py-2 text-crt-amber underline transition-colors hover:text-crt-ink hover:text-glow-amber"
        data-testid="marquee-github"
        href={ATTRIBUTION.links.github}
        rel="noreferrer"
        target="_blank"
      >
        STAR THIS PROJECT ON GITHUB
      </a>
      <span className="text-crt-ink">|</span>
      <a
        className="inline-flex min-h-[44px] items-center px-2 py-2 text-crt-amber underline transition-colors hover:text-crt-ink hover:text-glow-amber"
        data-testid="marquee-twitter"
        href={ATTRIBUTION.links.twitter}
        rel="noreferrer"
        target="_blank"
      >
        FOLLOW {ATTRIBUTION.creator.twitterHandle}
      </a>
    </>
  );

  return (
    <div
      className="h-11 overflow-hidden border-b border-crt-line/40 bg-crt-void/95 max-xs:h-10"
      data-testid="marquee"
      data-system="marquee"
    >
      <div className="inline-flex w-max items-center font-mono text-[14px] text-crt-ink animate-marquee motion-reduce:animate-none max-xs:text-[12px]">
        <div className="inline-flex items-center gap-4 whitespace-nowrap pr-8 max-xs:gap-3 max-xs:pr-6" data-testid="marquee-track">
          {content}
        </div>
      </div>
    </div>
  );
}
