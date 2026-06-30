import { contact, meta } from "../data/site.js";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative z-10 border-t border-line">
      <div className="section-pad-tight mx-auto max-w-3xl text-center">
        <span className="eyebrow justify-center">
          <span className="before:hidden" />
          {contact.eyebrow}
        </span>
        <h2 className="mt-6 font-serif text-hero text-ink text-balance">{contact.heading}</h2>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted">
          {contact.text}
        </p>
        <a href={`mailto:${contact.email}`} className="btn-primary mt-10">
          {contact.email}
        </a>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm">
          {contact.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="text-muted transition duration-300 hover:text-accent"
            >
              {s.label}
            </a>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-2 border-t border-line pt-8 text-xs text-muted/60">
          <p>
            © {year} {meta.name}. All rights reserved.
          </p>
          <p>{meta.since}</p>
        </div>
      </div>
    </footer>
  );
}
