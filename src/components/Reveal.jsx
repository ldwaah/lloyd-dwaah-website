/** Content is always visible — no scroll-triggered hiding. */
export const REVEAL_DEFAULT_DELAY = 0;

export default function Reveal({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function RevealStagger({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function RevealLines({ lines, className = "", lineClassName = "" }) {
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <span key={i} className={`block ${lineClassName}`}>
          {line}
        </span>
      ))}
    </div>
  );
}
