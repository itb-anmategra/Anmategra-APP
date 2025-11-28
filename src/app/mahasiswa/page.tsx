import { api } from '~/trpc/server';
import HeroSection from '../_components/landing/hero';
import { KegiatanSection } from '../_components/landing/kegiatan-section';
import { KepanitiaanSection } from '../_components/landing/kepanitiaan-section';

const LandingPage = async () => {
  const kegiatanTerbesar = await api.landing.getTopEvents();
  const kegiatanTerbaru = await api.landing.getRecentEvents();

  return (
    <main className="flex flex-col overflow-hidden sm:space-y-4 md:space-y-8">
      <HeroSection />
      <div className="space-y-16">
        <KegiatanSection data={kegiatanTerbaru} />
        <KepanitiaanSection data={kegiatanTerbesar} />
      </div>
    </main>
  );
};

export default LandingPage;
