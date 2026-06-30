import React from "react";
import ReactDOM from "react-dom/client";
import { SmoothScrollProvider } from "../components/SmoothScroll.jsx";
import "../index.css";

export function mount(Page) {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <SmoothScrollProvider>
        <Page />
      </SmoothScrollProvider>
    </React.StrictMode>
  );
}
