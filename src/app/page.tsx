// Component Import
// Auth Import
import { getServerAuthSession } from '~/server/auth';
// TRPC Import
import { api } from '~/trpc/server';

import HeroSection from './_components/landing/hero';
import { KegiatanSection } from './_components/landing/kegiatan-section';
import { KepanitiaanSection } from './_components/landing/kepanitiaan-section';
import Navbar from './_components/layout/navbar';
import Staff from './lembaga/kegiatan/[kegiatanId]/_components/BestStaff';
import {
  divisions,
  months,
  years,
} from './lembaga/kegiatan/[kegiatanId]/_components/staffData';

const LandingPage = async () => {
  const kegiatanTerbesar = await api.landing.getTopEvents();
  const kegiatanTerbaru = await api.landing.getRecentEvents();
  const session = await getServerAuthSession();

  return (
    <main className="flex flex-col overflow-hidden pb-16 sm:space-y-4 md:space-y-8">
      <div className="mb-12 fixed w-full shadow-sm z-20">
        <Navbar session={session} />
      </div>
      <HeroSection />
      <Staff divisions={divisions} months={months} years={years} />
      <div className="space-y-16">
        <KegiatanSection data={kegiatanTerbaru} />
        <KepanitiaanSection data={kegiatanTerbesar} />
      </div>
    </main>
  );
};

export default LandingPage;
