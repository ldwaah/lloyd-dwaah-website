import { useCallback, useEffect, useRef, useState } from "react";
import { ethos } from "../data/site.js";

const DEFAULT_ID = "leadership";

/** Higgsfield slot — matte black double-bridge frame, front-on, navy backdrop. */
export const SUNGLASSES_BACKGROUND = "#16242f";

export const SUNGLASSES_BASE_ASSETS = [
  "/assets/principles/sunglasses-base.webp",
  "/assets/principles/sunglasses-base.png",
  "/assets/principles/sunglasses.svg",
];

/** @deprecated Use SUNGLASSES_BASE_ASSETS — kept for any external imports */
export const HIGGSFIELD_SUNGLASSES_SLOT = SUNGLASSES_BASE_ASSETS[SUNGLASSES_BASE_ASSETS.length - 1];

/** Lens positions tuned to sunglasses.svg / front-on Higgsfield frame (2:1). */
const LENS_LAYOUT = {
  left: { left: "13.5%", top: "19%", width: "34%", height: "46%" },
  right: { left: "52.5%", top: "19%", width: "34%", height: "46%" },
};

const LENS_CROSSFADE_MS = 650;

function useCascadeImage(candidates, resetKey) {
  const [index, setIndex] = useState(0);
  const exhausted = index >= candidates.length;

  const onError = useCallback(() => {
    setIndex((current) => current + 1);
  }, []);

  useEffect(() => {
    setIndex(0);
  }, [resetKey ?? candidates.join("|")]);

  return {
    src: exhausted ? null : candidates[index],
    onError,
    exhausted,
  };
}

function GlassReflection() {
  return (
    <>
      <span
        className="pointer-events-none absolute inset-0 opacity-75"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 38%, rgba(0,0,0,0.14) 100%)",
        }}
        aria-hidden="true"
      />
      <span
        className="pointer-events-none absolute left-[12%] top-[10%] h-[28%] w-[22%] rounded-full opacity-35 blur-[1px]"
        style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.85), transparent)" }}
        aria-hidden="true"
      />
    </>
  );
}

function CssLensPair({ shadeSwatch }) {
  return (
    <>
      {(["left", "right"]).map((side) => (
        <div
          key={side}
          className="absolute overflow-hidden"
          style={{
            ...LENS_LAYOUT[side],
            borderRadius: "48% / 42%",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.35), inset 0 -1px 4px rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{ background: shadeSwatch, opacity: 0.9 }}
          />
          <GlassReflection />
        </div>
      ))}
    </>
  );
}

function ShadeLensLayer({ shadeSwatch, isActive }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 transition-opacity ease-in-out"
      style={{
        opacity: isActive ? 1 : 0,
        transitionDuration: `${LENS_CROSSFADE_MS}ms`,
      }}
      aria-hidden={!isActive}
    >
      <CssLensPair shadeSwatch={shadeSwatch} />
    </div>
  );
}

function SunglassesVisual({ principles, activeId }) {
  const { src: baseSrc, onError: onBaseError } = useCascadeImage(SUNGLASSES_BASE_ASSETS);

  return (
    <div
      className="relative mx-auto flex w-full max-w-md items-center justify-center"
      data-higgsfield-slot="sunglasses-visual"
      role="img"
      aria-label="Sunglasses"
    >
      <div
        className="relative aspect-[2/1] w-full max-w-sm overflow-hidden rounded-xl"
        style={{ backgroundColor: SUNGLASSES_BACKGROUND }}
      >
        {baseSrc ? (
          <img
            src={baseSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-contain"
            onError={onBaseError}
          />
        ) : null}

        <div className="absolute inset-0">
          {principles.map((principle) => (
            <ShadeLensLayer
              key={principle.id}
              shadeSwatch={principle.shadeSwatch}
              isActive={principle.id === activeId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CarouselArrow({ direction, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous shade" : "Next shade"}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line/70 text-muted/70 transition-colors hover:border-line hover:text-ink disabled:pointer-events-none disabled:opacity-25"
    >
      <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
        {direction === "left" ? (
          <path d="M10 3 5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}

function GlassSwatch({ shadeSwatch, isActive }) {
  return (
    <span
      className={`flex h-8 w-8 items-center justify-center rounded-full border transition-[border-color,box-shadow] duration-300 ${
        isActive
          ? "border-white/55 shadow-[0_0_0_1px_rgba(255,255,255,0.2)]"
          : "border-line/45 group-hover:border-line/70"
      }`}
    >
      <span
        className="relative h-5 w-5 overflow-hidden rounded-full transition-transform duration-300"
        style={{
          background: shadeSwatch,
          boxShadow:
            "inset 0 1px 2px rgba(255,255,255,0.45), inset 0 -1px 2px rgba(0,0,0,0.22), 0 1px 2px rgba(0,0,0,0.18)",
          transform: isActive ? "scale(1.05)" : "scale(1)",
        }}
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-full opacity-70"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, transparent 42%, rgba(0,0,0,0.12) 100%)",
          }}
          aria-hidden="true"
        />
      </span>
    </span>
  );
}

function ShadeCarousel({ principles, activeId, onSelect }) {
  const trackRef = useRef(null);
  const activeIndex = principles.findIndex((p) => p.id === activeId);

  const scrollToIndex = (index) => {
    const track = trackRef.current;
    const item = track?.children[index];
    if (item) {
      item.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  const selectIndex = (index) => {
    const clamped = Math.max(0, Math.min(principles.length - 1, index));
    onSelect(principles[clamped].id);
    scrollToIndex(clamped);
  };

  useEffect(() => {
    scrollToIndex(activeIndex);
  }, [activeIndex]);

  return (
    <div className="mx-auto mt-10 max-w-xl">
      <p className="text-center text-[11px] font-medium tracking-[0.14em] text-muted/75">
        Select shade
      </p>

      <div className="mt-4 flex items-center gap-3">
        <CarouselArrow
          direction="left"
          disabled={activeIndex <= 0}
          onClick={() => selectIndex(activeIndex - 1)}
        />

        <div
          ref={trackRef}
          className="flex min-w-0 flex-1 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 py-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {principles.map((principle, index) => {
            const isActive = principle.id === activeId;
            return (
              <button
                key={principle.id}
                type="button"
                onClick={() => onSelect(principle.id)}
                aria-pressed={isActive}
                aria-label={`Shade ${index + 1}`}
                className="group flex shrink-0 snap-center px-1"
              >
                <GlassSwatch shadeSwatch={principle.shadeSwatch} isActive={isActive} />
              </button>
            );
          })}
        </div>

        <CarouselArrow
          direction="right"
          disabled={activeIndex >= principles.length - 1}
          onClick={() => selectIndex(activeIndex + 1)}
        />
      </div>
    </div>
  );
}

function ActivePrincipleTitle({ principle }) {
  return (
    <h2
      key={principle.id}
      className="mx-auto mt-12 max-w-3xl font-serif text-hero text-ink text-balance"
      aria-live="polite"
    >
      {principle.title}
    </h2>
  );
}

export default function CorePrinciples() {
  const [activeId, setActiveId] = useState(DEFAULT_ID);
  const active =
    ethos.principles.find((p) => p.id === activeId) ?? ethos.principles[0];

  return (
    <section id="principles" className="relative z-10 overflow-hidden border-t border-line bg-hq-deep">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(94,234,255,0.08), transparent 70%)",
        }}
      />

      <div className="section-pad relative mx-auto max-w-4xl text-center">
        <SunglassesVisual principles={ethos.principles} activeId={activeId} />

        <ShadeCarousel
          principles={ethos.principles}
          activeId={activeId}
          onSelect={setActiveId}
        />

        <ActivePrincipleTitle principle={active} />
      </div>
    </section>
  );
}
