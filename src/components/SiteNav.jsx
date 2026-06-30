import { useState } from "react";
import { StackedLogo, CenterEmblem } from "./BrandMark.jsx";
import MenuToggle from "./MenuToggle.jsx";
import FullScreenMenu from "./FullScreenMenu.jsx";
import { avatarConfig } from "../data/site.js";

export default function SiteNav({ transparent = false }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          menuOpen ? "pointer-events-none opacity-0" : transparent ? "bg-transparent" : "bg-hq/80 backdrop-blur-xl"
        }`}
      >
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-10">
          <StackedLogo />
          <CenterEmblem src={avatarConfig.image} />
          <MenuToggle open={false} onClick={() => setMenuOpen(true)} />
        </nav>
      </header>

      <FullScreenMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
