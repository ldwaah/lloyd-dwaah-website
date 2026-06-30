import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import BookPage from "./components/BookPage.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen w-full overflow-x-hidden bg-canvas text-body">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/writing/:slug" element={<BookPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
