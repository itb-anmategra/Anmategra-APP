// Component Import
import HeroSection from "./_components/landing/hero";
import {KegiatanSection} from "./_components/landing/KegiatanSection";
import {KepanitiaanSection} from "./_components/landing/KepanitiaanSection";
import MahasiswaSidebar from "./_components/MahasiswaSidebar";
import {api} from "~/trpc/server";
import {getServerAuthSession} from "~/server/auth";

const LandingPage = async () => {

    const kepanitiaanTerbaru = await api.landing.getRecentKepanitiaan();
  const kegiatanTerbaru = await api.landing.getRecentEvents();
    const session = await getServerAuthSession();
    const sessionId = session?.user?.id;

  return (
      <main className="flex flex-col overflow-hidden pb-16 sm:space-y-4 md:space-y-8">
          <div className="mb-12 fixed w-full shadow-sm z-20">
              <MahasiswaSidebar session={session?.user.id ?? ""}/>
          </div>
          <HeroSection/>
          <div className="space-y-16">
              <KepanitiaanSection data={kepanitiaanTerbaru}/>
              <KegiatanSection data={kegiatanTerbaru}/>
          </div>
      </main>
  );
};

export default LandingPage;