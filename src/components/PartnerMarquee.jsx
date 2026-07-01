import { organisations } from "../data/site.js";
import { prefersReducedMotion } from "../lib/input.js";

function PartnerLogo({ partner }) {
  const content = (
    <img
      src={partner.logo}
      alt={partner.name}
      width={240}
      height={80}
      loading="lazy"
      decoding="async"
      className="h-8 w-auto max-h-8 object-contain opacity-[0.55] transition-opacity duration-300 hover:opacity-100 md:h-10 md:max-h-10"
    />
  );

  const shellClass =
    "inline-flex h-10 w-[11.5rem] shrink-0 items-center justify-center px-4 md:h-10 md:w-[13rem] md:px-5";

  if (partner.url) {
    return (
      <a
        href={partner.url}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={partner.name}
        className={shellClass}
      >
        {content}
      </a>
    );
  }

  return <span className={shellClass}>{content}</span>;
}

export default function PartnerMarquee() {
  const reduced = prefersReducedMotion();
  const track = [...organisations.items, ...organisations.items];

  return (
    <section
      aria-label={organisations.eyebrow}
      className="relative z-10 overflow-hidden border-y border-line bg-hq-deep py-12 md:py-16"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(90deg, #16242f 0%, transparent 12%, transparent 88%, #16242f 100%)",
        }}
      />

      <div className="relative mx-auto mb-8 max-w-7xl px-6 md:mb-10 md:px-10">
        <span className="eyebrow eyebrow-center mx-auto max-w-fit">{organisations.eyebrow}</span>
      </div>

      {reduced ? (
        <div className="relative mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-8 px-6 md:gap-x-12 md:px-10">
          {organisations.items.map((partner) => (
            <PartnerLogo key={partner.id} partner={partner} />
          ))}
        </div>
      ) : (
        <div className="partner-marquee relative">
          <div className="partner-marquee-track">
            {track.map((partner, index) => (
              <PartnerLogo key={`${partner.id}-${index}`} partner={partner} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
