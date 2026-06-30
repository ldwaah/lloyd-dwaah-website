import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";

export function mount(Page) {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <Page />
    </React.StrictMode>
  );
}
