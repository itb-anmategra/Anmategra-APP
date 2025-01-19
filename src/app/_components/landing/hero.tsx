import Image from "next/image";
import { SearchBar } from "../placeholder/search-bar";

export default function HeroSection() {
  return (
    <div className="relative mx-4 flex min-h-screen flex-col">
      {/* Small Ellipse */}
      <Image
        src="/images/landing/Ellipse16.png"
        alt="Ellipse16"
        height={760}
        width={760}
        className="absolute left-1/2 top-[19%] z-[-1] -translate-x-1/2 -translate-y-1/2 scale-100 sm:top-[21%] sm:scale-[0.75] md:top-[20%] md:scale-[0.7] lg:top-[31%] lg:scale-100 xl:top-[35%] xl:scale-100"
        priority
      />
      {/* Bigger Ellipse */}
      <Image
        src="/images/landing/Ellipse15.png"
        alt="Ellipse15"
        height={1140}
        width={1140}
        className="absolute left-1/2 top-[25%] z-[-2] -translate-x-1/2 -translate-y-1/2 scale-150 sm:top-[25%] sm:scale-125 md:top-[25%] md:scale-100 lg:top-[38%] xl:top-[44%] xl:scale-100"
        priority
      />
      {/* Blue Glow */}
      <Image
        src="/images/landing/Ellipse17.png"
        alt="Glow Effect"
        width={1200}
        height={1200}
        className="absolute left-1/2 top-[55%] z-[-3] -translate-x-1/2 -translate-y-1/2 border-black"
        priority
      />
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-7xl font-medium tracking-tight">
              Pendataan Mahasiswa
              <p className="mt-3 bg-gradient-to-b from-[#0B5C8A] to-[#00B7B7] bg-clip-text text-transparent">
                Terintegrasi
              </p>
            </h1>

            <p className="my-5 text-balance text-xl">
              Cari kegiatan, lembaga, atau mahasiswa yang Anda inginkan sekarang
            </p>

            <div className="mb-14 mt-3 w-[450px] max-w-2xl">
              <SearchBar placeholder="Pencarian lembaga, kegiatan, atau mahasiswa" />
            </div>

            <div className="relative flex w-full max-w-4xl items-center justify-center">
              <Image
                src="/images/landing/ANGGOTA1.png"
                alt="ANGGOTA1"
                width={725}
                height={725} // auto
                className="top-0 rounded-3xl border-black shadow-[0px_4px_72px_0px_#3174981A]"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
