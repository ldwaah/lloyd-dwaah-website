import { useState } from "react";
import { StackedLogo, CenterEmblem } from "./BrandMark.jsx";
import MenuToggle from "./MenuToggle.jsx";
import FullScreenMenu from "./FullScreenMenu.jsx";
import { avatarConfig, headerNav } from "../data/site.js";

function isHeaderActive(href) {
  const path = window.location.pathname;
  const hash = window.location.hash;

  if (href === "#contact") return hash === "#contact";
  if (href === "/#principles" || href === "#principles") {
    return (path === "/" || path.endsWith("/index.html")) && hash === "#principles";
  }
  if (href.startsWith("/") && !href.includes("#")) {
    return path.endsWith(href.replace(/^\//, ""));
  }
  return false;
}

export default function SiteNav({ transparent = false }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[90] transition-all duration-500 ${
          transparent && !menuOpen ? "bg-transparent" : "bg-hq/80 backdrop-blur-xl"
        }`}
      >
        <nav className="relative mx-auto flex max-w-7xl items-center gap-6 px-6 py-5 md:px-10">
          <StackedLogo className="shrink-0" />

          <ul className="hidden flex-1 items-center justify-center gap-x-6 gap-y-2 md:flex lg:gap-x-8">
            {headerNav.map((item) => {
              const active = isHeaderActive(item.href);
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`font-sans text-[10px] font-bold uppercase tracking-[0.32em] transition-colors duration-300 md:text-[11px] ${
                      active ? "text-accent" : "text-ink/75 hover:text-accent"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <CenterEmblem src={avatarConfig.image} className="md:hidden" />

          <div className="ml-auto shrink-0">
            <MenuToggle open={menuOpen} onClick={toggleMenu} />
          </div>
        </nav>
      </header>

      <FullScreenMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
