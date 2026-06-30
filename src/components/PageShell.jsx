import SiteNav from "./SiteNav.jsx";
import SiteFooter from "./SiteFooter.jsx";
import AmbientBackground from "./AmbientBackground.jsx";

export default function PageShell({
  children,
  ambient = "default",
  navTransparent = false,
}) {
  return (
    <div className="relative min-h-screen">
      <AmbientBackground variant={ambient} />
      <div className="page-enter relative z-10">
        <SiteNav transparent={navTransparent} />
        <main className="pt-20">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
