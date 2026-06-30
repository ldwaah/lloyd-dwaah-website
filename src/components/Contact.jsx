import Reveal from "./Reveal.jsx";
import SectionIllustration from "./SectionIllustration.jsx";
import { contact, sectionIllustrations } from "../data/site.js";

export default function Contact() {
  const art = sectionIllustrations.contact;

  return (
    <section id="contact" className="section border-t border-line bg-canvas">
      <Reveal>
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl border border-line bg-white p-8 shadow-card md:grid-cols-[1fr_0.7fr] md:gap-10 md:p-10">
          <div className="text-center md:text-left">
            <span className="eyebrow justify-center md:justify-start">{contact.eyebrow}</span>
            <h2 className="mt-4 max-w-xl text-balance text-statement serif text-ink">
              {contact.heading}
            </h2>
            <p className="mt-4 max-w-lg text-pretty leading-relaxed text-muted">
              {contact.text}
            </p>

            <div className="mt-6">
              <a href={`mailto:${contact.email}`} className="btn-accent">
                {contact.email}
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm md:justify-start">
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

          <div className="flex justify-center md:justify-end">
            <SectionIllustration
              src={art.src}
              alt={art.alt}
              caption={art.caption}
              size="large"
            />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
