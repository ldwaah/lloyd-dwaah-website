import { useEffect } from "react";
import React from "react";
import ReactDOM from "react-dom/client";
import { SmoothScrollProvider } from "../components/SmoothScroll.jsx";
import PageTransition from "../components/PageTransition.jsx";
import { initPageTransitionLinks } from "../lib/pageTransition.js";
import { resetScrollPosition, enableManualScrollRestoration } from "../lib/scrollReset.js";
import "../index.css";

if (typeof window !== "undefined") {
  enableManualScrollRestoration();
  resetScrollPosition();
}

function MotionShell({ children }) {
  useEffect(() => {
    initPageTransitionLinks(document);
  }, []);

  return children;
}

export function mount(Page) {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <SmoothScrollProvider>
        <MotionShell>
          <PageTransition />
          <Page />
        </MotionShell>
      </SmoothScrollProvider>
    </React.StrictMode>
  );
}
