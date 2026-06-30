import SiteNav from "./SiteNav.jsx";
import SiteFooter from "./SiteFooter.jsx";

export default function PageShell({ children, className = "" }) {
  return (
    <div className={`min-h-screen bg-canvas ${className}`}>
      <SiteNav />
      <main className="pt-16">{children}</main>
      <SiteFooter />
    </div>
  );
}
