import { contact, meta } from "../data/site.js";
import { EmailIcon, LinkedInIcon, SocialIconLink } from "./SocialIcons.jsx";
import Reveal from "./Reveal.jsx";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative z-10 border-t border-line">
      <div className="section-pad-tight mx-auto max-w-3xl text-center">
        <Reveal>
          <span className="eyebrow eyebrow-center">{contact.eyebrow}</span>
          <h2 className="mt-6 font-serif text-hero text-ink text-balance">{contact.heading}</h2>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted">
            {contact.text}
          </p>
        </Reveal>

        <Reveal delay={0.12} y={16}>
          <div className="mt-10 flex items-center justify-center gap-4">
            <SocialIconLink href={`mailto:${contact.email}`} label="Email Lloyd Dwaah">
              <EmailIcon />
            </SocialIconLink>
            <SocialIconLink href={contact.linkedin} label="Lloyd Dwaah on LinkedIn" external>
              <LinkedInIcon />
            </SocialIconLink>
          </div>
        </Reveal>

        <Reveal delay={0.2} y={12}>
          <div className="mt-16 border-t border-line pt-8 text-xs text-muted/60">
            <p>
              © {year} {meta.name}. All rights reserved.
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
