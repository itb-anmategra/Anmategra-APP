import "~/styles/globals.css";
// Font Import
import {GeistSans} from "geist/font/sans";
// Library Import
import {type Metadata} from "next";
import {TRPCReactProvider} from "~/trpc/react";
import Image from "next/image";
// Image Import
import LogoAnmategra from "public/images/logo/anmategra-logo-full.png";
import Mascot from "public/images/logo/mascot.png";
import Kabinet from "public/images/logo/kabinet-logo-full.png";
// Components Import
import { Toaster } from "~/components/ui/toaster"
import Footer from "./_components/Footer";
// Metadata
export const metadata: Metadata = {
  title: "Anmategra",
  description: "Anmategra by KM ITB",
  icons: [{ rel: "icon", url: "/images/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
      <html lang="en" className={`${GeistSans.variable}`}>
        <body className="bg-neutral-100 overflow-auto">
          <div className="min-h-screen flex flex-col hidden lg:block">
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
          <Toaster />
        </body>
      </html>
  );
}
