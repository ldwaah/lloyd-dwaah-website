import ScrollProgress from "../components/ScrollProgress.jsx";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Ethos from "../components/Ethos.jsx";
import Experience from "../components/Experience.jsx";
import Ventures from "../components/Ventures.jsx";
import Writing from "../components/Writing.jsx";
import Horizon from "../components/Horizon.jsx";
import Contact from "../components/Contact.jsx";
import Footer from "../components/Footer.jsx";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Ethos />
        <Experience />
        <Ventures />
        <Writing />
        <Horizon />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
