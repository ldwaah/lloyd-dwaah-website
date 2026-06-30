import { contact, meta } from "../data/site.js";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-line bg-navy text-white">
      <div className="mx-auto max-w-3xl px-6 py-14 text-center">
        <span className="inline-flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-eyebrow text-white/60">
          <span className="h-px w-8 bg-white/35" />
          {contact.eyebrow}
          <span className="h-px w-8 bg-white/35" />
        </span>
        <h2 className="mt-4 font-serif text-2xl text-white md:text-3xl">{contact.heading}</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/70">
          {contact.text}
        </p>
        <a
          href={`mailto:${contact.email}`}
          className="mt-6 inline-flex rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          {contact.email}
        </a>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
          {contact.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="text-white/65 transition hover:text-white"
            >
              {s.label}
            </a>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-2 border-t border-white/10 pt-6 text-xs text-white/45">
          <p>
            © {year} {meta.name}. All rights reserved.
          </p>
          <p>{meta.since}</p>
        </div>
      </div>
    </footer>
  );
}
