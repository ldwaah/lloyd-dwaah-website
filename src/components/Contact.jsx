import Reveal from "./Reveal.jsx";
import { contact } from "../data/site.js";

export default function Contact() {
  return (
    <section id="contact" className="section border-t border-line bg-canvas">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-line bg-white px-8 py-16 text-center shadow-card md:px-16 md:py-20">
          <span className="eyebrow justify-center">{contact.eyebrow}</span>
          <h2 className="mx-auto mt-6 max-w-2xl text-balance text-statement serif text-ink">
            {contact.heading}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-muted">
            {contact.text}
          </p>

          <div className="mt-8">
            <a href={`mailto:${contact.email}`} className="btn-accent">
              {contact.email}
            </a>
          </div>

          <div className="mt-8 flex items-center justify-center gap-8 text-sm">
            {contact.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="link-underline"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
