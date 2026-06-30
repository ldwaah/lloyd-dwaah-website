import ScrollProgress from "../components/ScrollProgress.jsx";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Highlights from "../components/Highlights.jsx";
import Ethos from "../components/Ethos.jsx";
import Experience from "../components/Experience.jsx";
import Ventures from "../components/Ventures.jsx";
import Publications from "../components/Publications.jsx";
import Contact from "../components/Contact.jsx";
import Footer from "../components/Footer.jsx";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Highlights />
        <Ethos />
        <Experience />
        <Ventures />
        <Publications />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
