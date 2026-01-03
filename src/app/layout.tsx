// Font Import
import { GeistSans } from 'geist/font/sans';
// Library Import
import { type Metadata } from 'next';
import Image from 'next/image';
import Kabinet from 'public/images/kabinet.png';
// Image Import
import LogoAnmategra from 'public/images/logo-anmategra.png';
import Mascot from 'public/images/mascot.png';
// Components Import
import { Toaster } from '~/components/ui/toaster';
import '~/styles/globals.css';
import { TRPCReactProvider } from '~/trpc/react';

import Footer from './_components/Footer';

// Metadata
export const metadata: Metadata = {
  title: 'Anmategra',
  description: 'Anmategra by KM ITB',
  icons: [{ rel: 'icon', url: '/images/favicon.ico' }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-neutral-100 overflow-auto">
        <div className="w-full h-screen flex flex-col justify-center relative">
          <div className="absolute flex items-center justify-center py-12 top-0 left-0 right-0">
            <Image
              src={LogoAnmategra}
              alt="Logo Anmategra"
              width={210}
              height={112}
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <Image src={Mascot} alt="Mascot" width={240} height={180} />
            <h1 className="text-[#00B7B7] text-xl font-bold">
              Sedang Dalam Pengembangan
            </h1>
            <h2 className="text-center text-md">
              Aplikasi ini masih dalam tahap pengembangan. <br />
              Kami sedang bekerja keras untuk segera menghadirkannya untuk Anda.
            </h2>
          </div>
        </div>
        {/* <div className="min-h-screen flex flex-col hidden lg:block">
            <div className="flex-1">
              <TRPCReactProvider>{children}</TRPCReactProvider>
            </div>
            <Footer />
          </div>
          <div className="w-full h-screen flex flex-col justify-between lg:hidden">
            <div className="flex items-center justify-center py-12">
              <Image 
                src={LogoAnmategra}
                alt="Logo Anmategra"
                width={210}
                height={112}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <Image 
                src={Mascot}
                alt="Mascot"
                width={240}
                height={180}
              />
              <h1 className="text-[#00B7B7] text-xl font-bold">Tampilan Tidak Tersedia</h1>
              <h2 className="text-center text-md">
                Silahkan buka menggunakan <br/><span className="font-bold">pc / desktop</span>
              </h2>
            </div>
            <div className="flex items-center justify-center py-12">
              <Image 
                src={Kabinet}
                alt="Kabinet"
                width={340}
                height={45}
              />
            </div>
          </div>
          <Toaster /> */}
      </body>
    </html>
  );
}
