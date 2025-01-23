import "~/styles/globals.css";

// Font Import
import {GeistSans} from "geist/font/sans";

// Library Import
import {type Metadata} from "next";
import {TRPCReactProvider} from "~/trpc/react";
import {HydrateClient} from "~/trpc/server";

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
        <TRPCReactProvider>
          {children}
        </TRPCReactProvider>
        </body>
      </html>
  );
}
