// Props Import
import Image from "next/image";
import Link from "next/link";
// Components Import
import { Button } from "~/components/ui/button";


const LaporanPage = () => {
  return (
    // <LaporanMainContainer data={DummyData}/>
    <div className="w-full h-screen bg-gray-50">
      {/* <MahasiswaSidebar /> */}
      
      <main className="h-full flex flex-col items-center justify-center w-full">
        <div className="relative w-full">
          <div className="absolute left-0 top-16 -translate-y-1/2 w-48 h-96 opacity-20">
            <Image 
              src='/placeholder/coming-soon1.png'
              alt="Coming Soon decoration"
              width={192}
              height={384}
            />
          </div>
          <div className="absolute right-0 top-16 -translate-y-1/2 w-48 h-96 opacity-20">
          <Image 
              src='/placeholder/coming-soon2.png'
              alt="Coming Soon decoration"
              width={192}
              height={384}
            />
          </div>
          
          <div className="text-center relative z-10">
            <h1 className="text-6xl font-bold text-[#2B6777] mb-6">
              Coming Soon
            </h1>
            <p className="text-2xl text-gray-400 mb-12">
              Kami sedang membangun sesuatu yang menarik untuk Anda
            </p>
            <Link href="/lembaga">
              <Button className="bg-[#2B6777] hover:bg-[#2B6777]/90 text-white px-8 py-6 text-lg">
                Kembali ke Beranda
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LaporanPage;
