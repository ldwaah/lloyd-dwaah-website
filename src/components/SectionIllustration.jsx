/**
 * Editorial section art — portrait-based illustration frames.
 * Swap `src` values in site.js when Higgsfield-generated assets are ready.
 */
export default function SectionIllustration({
  src,
  alt,
  caption,
  className = "",
  size = "default",
}) {
  const sizeClass =
    size === "large"
      ? "h-56 w-56 md:h-64 md:w-64"
      : size === "compact"
        ? "h-36 w-36"
        : "h-44 w-44 md:h-52 md:w-52";

  return (
    <figure className={`flex flex-col items-center ${className}`}>
      <div
        className={`relative overflow-hidden rounded-2xl border border-line bg-white shadow-card ${sizeClass}`}
      >
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          loading="lazy"
          draggable={false}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 max-w-[14rem] text-center text-[11px] font-medium uppercase tracking-[0.16em] text-brand/80">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
