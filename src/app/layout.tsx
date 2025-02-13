import "~/styles/globals.css";
// Font Import
import {GeistSans} from "geist/font/sans";
// Library Import
import {type Metadata} from "next";
import {TRPCReactProvider} from "~/trpc/react";
// Components Import
import { Toaster } from "~/components/ui/toaster"
import Footer from "./_components/Footer";
// Metadata
export const metadata: Metadata = {
  title: "Anmategra",
  description: "Anmategra by KM ITB",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
      <html lang="en" className={`${GeistSans.variable}`}>
        <body className="bg-neutral-100 overflow-auto">
          <div className="hidden lg:block">
            <TRPCReactProvider>
                {children}
                <Footer />
            </TRPCReactProvider>
          </div>
          <div className="w-full h-screen flex flex-col justify-center items-center lg:hidden">
            <p className="text-secondary-400 text-xl">Silakan Buka Dalam Desktop View.</p>
          </div>
          <Toaster />
        </body>
      </html>
  );
}
