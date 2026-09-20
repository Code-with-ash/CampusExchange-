import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import CategoriesSection from "./components/CategoriesSection";
import HowItWorksSection from "./components/HowItWorksSection";
import ListingsSection from "./components/ListingsSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <HowItWorksSection />
      <ListingsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
