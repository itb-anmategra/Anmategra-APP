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
  HomeIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { LogOut } from 'lucide-react';
// Components Import
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip"
// Type Import
import type { Lembaga } from "~/types/lembaga";
// Lib Import
import { cn } from "~/lib/utils";
// Auth Import
import {Session} from "next-auth";
import {signOut} from "next-auth/react";

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
        session: Session | null
    }
) => {

    const lembaga: Lembaga = {
        id: session?.user.lembagaId ?? '',
        name: session?.user.name ?? '',
        profilePicture: session?.user.image ?? ''
    }

  return (
    <>
      <div className="ml-[16rem]" />
      <div className="w-[16rem] border-r bg-neutral-50 p-6 fixed left-0 h-screen">
        <nav className="w-full h-full flex flex-col justify-between">
          <div className="space-y-6">
            <Link href={"/"}>
              <Image
                src="/logo-anmategra.png"
                alt="Logo Anmategra"
                width={150}
                height={50}
              />
            </Link>
            <SidebarItems />
          </div>
          <SidebarProfile lembaga={lembaga} />
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
  console.log(lembaga)
  return (
    <div className="flex w-full flex-col gap-y-2">
      <Link href={`/lembaga/profil-lembaga/${lembaga.id}`}>
        <div className="flex items-center gap-4 px-1 py-2">
          <Avatar>
            <AvatarImage
              className="object-contain"
              src={lembaga.profilePicture ?? ""}
            />
            <AvatarFallback>{lembaga.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="line-clamp-1 font-semibold p-0 m-0 -translate-x-3">
                  {lembaga.name}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{lembaga.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="line-clamp-1 text-xs text-neutral-700">Lembaga</span>
          </div>
        </div>
      </Link>
      <Button
        variant="destructive"
        className="flex items-center justify-start gap-3 bg-transparent px-3 py-2 text-base text-destructive shadow-none hover:text-destructive-foreground"
        onClick={() => {
            signOut({callbackUrl: '/'})
        }}
      >
        <LogOut /> Keluar
      </Button>
    </div>
  );
};
