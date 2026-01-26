// Font Import
import { GeistSans } from 'geist/font/sans';
// Library Import
import { type Metadata } from 'next';
// Components Import
import { Toaster } from '~/components/ui/toaster';
import '~/styles/globals.css';
import { TRPCReactProvider } from '~/trpc/react';

import Footer from './_components/layout/footer';

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
        <div className="min-h-screen flex flex-col">
          <div className="flex-1">
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </div>
          <div className="sticky z-[10]">
            <Footer />
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
