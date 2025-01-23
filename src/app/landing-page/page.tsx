import HeroSection from "../_components/landing/hero";
import { KegiatanSection } from "../_components/landing/KegiatanSection";
import { KepanitiaanSection } from "../_components/landing/KepanitiaanSection";

const LandingPage = () => {
  return (
    <main className="flex flex-col overflow-hidden pb-16 sm:space-y-4 md:space-y-8">
      <HeroSection />
      <div className="space-y-16">
        <KepanitiaanSection />
        <KegiatanSection />
      </div>
    </main>
  );
};

export default LandingPage;
