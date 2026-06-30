import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PageShell from "../components/PageShell.jsx";
import Reveal from "../components/Reveal.jsx";
import PublicationsIntro, {
  shouldPlayPublicationsIntro,
} from "../components/PublicationsIntro.jsx";
import { publications, featuredBookSlugs } from "../data/site.js";

const AUTHOR_HERO = "/assets/publications/author-hero.webp";
const ease = [0.22, 1, 0.36, 1];

const SPINE_COLORS = [
  "from-amber-900/80 to-amber-950",
  "from-slate-700/90 to-slate-900",
  "from-rose-900/70 to-rose-950",
  "from-teal-900/70 to-teal-950",
];

const featuredBooks = featuredBookSlugs.map((slug) =>
  publications.books.find((book) => book.slug === slug)
).filter(Boolean);

function BookOnShelf({ book, index, order }) {
  const isUnavailable = book.status === "Not Available";
  const spineColor = SPINE_COLORS[index % SPINE_COLORS.length];

  return (
    <Reveal delay={index * 0.1} y={32} className="h-full">
    <motion.article
      className="perspective-1000 group relative flex h-full flex-col items-center"
      whileHover={{ zIndex: 20 }}
    >
      <p className="mb-4 text-[10px] font-light uppercase tracking-[0.28em] text-muted/60">
        {String(order).padStart(2, "0")}
      </p>

      <motion.div
        className="relative mx-auto w-full max-w-[140px] cursor-default"
        whileHover={{ y: -24, rotateY: -8, scale: 1.04 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className={`relative aspect-[2/3] overflow-hidden rounded-sm bg-gradient-to-b ${spineColor} shadow-lift ring-1 ring-white/10`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          <div className="flex h-full flex-col justify-between p-3">
            <span className="text-[8px] font-light uppercase tracking-[0.22em] text-gold/80">
              {book.kind}
            </span>
            <p
              className="font-serif text-[11px] leading-tight text-ink/90"
              style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
            >
              {book.title}
            </p>
          </div>
        </div>
      </motion.div>

      <h2 className="mt-5 max-w-[160px] text-center font-serif text-sm leading-snug text-ink">
        {book.title}
      </h2>

      {isUnavailable ? (
        <p className="mt-2 text-[10px] font-light uppercase tracking-[0.22em] text-muted/60">
          Coming Soon
        </p>
      ) : book.status ? (
        <p className="mt-2 text-[10px] font-light uppercase tracking-[0.22em] text-gold/80">
          {book.status}
        </p>
      ) : null}

      <div className="mt-5 flex w-full max-w-[160px] flex-col items-center gap-3">
        {book.amazon && (
          <a
            href={book.amazon}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-light uppercase tracking-[0.16em] text-ink/70 underline decoration-accent/30 underline-offset-[5px] transition-colors duration-300 hover:text-accent hover:decoration-accent"
          >
            View on Amazon
          </a>
        )}
        {book.trailer && (
          <a
            href={book.trailer}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full px-4 py-2.5 text-xs"
          >
            View Trailer
          </a>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="pointer-events-none absolute left-1/2 top-full z-30 mt-4 w-72 -translate-x-1/2 rounded-2xl border border-line glass-panel p-5 opacity-0 shadow-lift transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100"
      >
        <h3 className="font-serif text-lg text-ink">{book.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{book.description}</p>
      </motion.div>
    </motion.article>
    </Reveal>
  );
}

function Shelf({ books, label }) {
  return (
    <div className="relative">
      <Reveal y={16}>
      <p className="mb-8 text-[10px] font-light uppercase tracking-[0.28em] text-muted/50">
        {label}
      </p>
      </Reveal>
      <div className="relative grid grid-cols-2 gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
        {books.map((book, i) => (
          <BookOnShelf key={book.slug} book={book} index={i} order={i + 1} />
        ))}
      </div>
      <Reveal delay={0.15} y={16}>
      <div className="relative mt-10 h-3 rounded-sm bg-gradient-to-b from-amber-900/40 to-amber-950/60 shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]" />
      <div className="h-1 bg-black/30" />
      </Reveal>
    </div>
  );
}

export default function PublicationsPage() {
  const [playIntro, setPlayIntro] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    if (shouldPlayPublicationsIntro()) {
      setPlayIntro(true);
    } else {
      setContentVisible(true);
    }
  }, []);

  return (
    <PageShell ambient="publications">
      {playIntro && (
        <PublicationsIntro
          onFadeStart={() => setContentVisible(true)}
          onComplete={() => {
            setPlayIntro(false);
            setContentVisible(true);
          }}
        />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: contentVisible ? 1 : 0 }}
        transition={{ duration: 0.65, ease }}
        aria-hidden={!contentVisible}
      >
        <section className="relative min-h-[55vh] w-full overflow-hidden md:min-h-[62vh]">
          <img
            src={AUTHOR_HERO}
            alt="Lloyd Dwaah writing at his desk in a private study"
            className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-hq-darker via-hq-darker/55 to-hq-darker/15" />
          <div className="relative flex min-h-[55vh] flex-col justify-end section-pad pb-14 md:min-h-[62vh] md:pb-20">
            <Reveal y={20}>
              <span className="eyebrow">{publications.eyebrow}</span>
            </Reveal>
            <Reveal delay={0.08} y={36}>
              <h1 className="mt-8 max-w-3xl font-serif text-display text-ink">
                {publications.heading}
              </h1>
            </Reveal>
            <Reveal delay={0.16} y={28}>
              <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted">
                {publications.intro}
              </p>
            </Reveal>
          </div>
        </section>

        <section className="border-t border-line bg-hq-darker/50">
          <div className="section-pad mx-auto max-w-6xl">
            <div className="mb-20 flex items-end gap-8">
              <div className="flex-1">
                <Shelf books={featuredBooks} label="The collection" />
              </div>
            </div>

            <Reveal>
              <p className="text-center text-sm italic text-muted/70">{publications.note}</p>
            </Reveal>
          </div>
        </section>
      </motion.div>
    </PageShell>
  );
}
