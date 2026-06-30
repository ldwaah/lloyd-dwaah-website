import SiteNav from "./SiteNav.jsx";
import SiteFooter from "./SiteFooter.jsx";
import AmbientBackground from "./AmbientBackground.jsx";

export default function PageShell({ children, ambient = "default" }) {
  return (
    <div className="relative min-h-screen bg-hq-deep">
      <AmbientBackground variant={ambient} />
      <SiteNav />
      <main className="relative z-10">{children}</main>
      <SiteFooter />
    </div>
  );
}
