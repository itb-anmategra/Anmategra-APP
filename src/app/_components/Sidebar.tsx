"use client"
// Library Import
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// Icons Import
import {
  CalendarIcon,
  EnvelopeOpenIcon,
  ExclamationTriangleIcon,
  ExitIcon,
  HomeIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
// Components Import
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
// Type Import
import type { Lembaga } from "~/types/lembaga";
// Lib Import
import { cn } from "~/lib/utils";
import {Session} from "next-auth";

type SidebarItemType = { 
  label: string; 
  href: string; 
  icon: React.ReactElement 
};

const SIDEBAR_ITEMS: SidebarItemType[] = [
  { label: "Beranda", href: "/lembaga", icon: <HomeIcon /> },
  { label: "Kegiatan", href: "/lembaga/kegiatan", icon: <CalendarIcon /> },
  { label: "Anggota", href: "/lembaga/anggota-kegiatan", icon: <PersonIcon /> },
  { label: "Inbox", href: "/lembaga/inbox", icon: <EnvelopeOpenIcon /> },
  { label: "Laporan", href: "/lembaga/laporan", icon: <ExclamationTriangleIcon /> },
];

export const Sidebar = (
    {
        session
    } : {
        session: Session
    }
) => {
  // if (pathname?.startsWith("/halaman-mahasiswa")) {
  //   return (
  //     <div className="w-full flex flex-col items-center justify-center bg-white border-b-2 border-neutral-100 mb-8">
  //       <div className="w-full max-w-7xl flex justify-between items-center py-4">
  //         <div>
  //           <Image 
  //             src={"/logo-anmategra.png"}
  //             alt="Logo Anmategra"
  //             width={150}
  //             height={50}
  //           />
  //         </div>
  //         <nav>
  //           <Link href={"/halaman-mahasiswa"}>
  //             Beranda
  //           </Link>
  //           <Link href={"/halaman-mahasiswa/laporan"}>
  //             Laporan
  //           </Link>
  //         </nav>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <>
      <div className="ml-[16rem]" />
      <div className="w-[16rem] border-r bg-neutral-50 p-6 fixed left-0 h-screen">
        <nav className="w-full h-full flex flex-col justify-between">
          <div className="space-y-6">
            <Link href={"/"}>
              <Image
                src={session.user.image ??"/logo-anmategra.png"}
                alt="Logo Anmategra"
                width={150}
                height={50}
              />
            </Link>
            <SidebarItems />
          </div>
          <SidebarProfile lembaga={{ name: session.user.name, profilePicture: session.user.image }} />
        </nav>
      </div>
    </>
  );
};

const SidebarItems = () => {
  const pathname = usePathname()

  return (
    <div className="flex flex-col gap-2">
      {SIDEBAR_ITEMS.map((item) => (
        <Button
          key={item.href}
          className="flex items-center justify-start px-4"
          variant="ghost"
          asChild
        >
          <Link 
            href={item.href}
            className={cn(
              "text-neutral-700",
              pathname === item.href && "bg-neutral-200 text-Blue-Dark"
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        </Button>
      ))}
    </div>
  );
};

const SidebarProfile = ({
    lembaga,
                        } : {
    lembaga: Lembaga;
}) => {

  return (
    <div className="flex w-full flex-col gap-y-2">
      <div className="flex items-center gap-4 px-1 py-2">
        <Avatar>
          <AvatarImage
            className="object-contain"
            src={lembaga.profilePicture}
          />
          <AvatarFallback>{lembaga.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0">
          <span className="line-clamp-1 font-semibold">{lembaga.name}</span>
          <span className="line-clamp-1 text-xs text-neutral-700">Lembaga</span>
        </div>
      </div>
      <Button
        variant="destructive"
        className="flex items-center justify-start gap-3 bg-transparent px-3 py-2 text-base text-destructive shadow-none hover:text-destructive-foreground"
      >
        <ExitIcon />
        Logout
      </Button>
    </div>
  );
};
