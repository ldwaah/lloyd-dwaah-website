import React from "react";
import ReactDOM from "react-dom/client";
import { SmoothScrollProvider } from "../components/SmoothScroll.jsx";
import "../index.css";

// Every page entry mounts through here, so wrapping once enables Lenis
// smooth scrolling site-wide. It's desktop-only and self-disables for
// touch / reduced-motion inside the provider — nothing changes visually.
export function mount(Page) {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <SmoothScrollProvider>
        <Page />
      </SmoothScrollProvider>
    </React.StrictMode>
  );
}
