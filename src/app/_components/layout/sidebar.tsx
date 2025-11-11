'use client';

// Library Import
// Icons Import
import {
  CalendarIcon,
  EnvelopeOpenIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  PersonIcon,
} from '@radix-ui/react-icons';
import { LogOut } from 'lucide-react';
// Auth Import
import { type Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
// Components Import
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Button } from '~/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';
// Lib Import
import { cn } from '~/lib/utils';
// Type Import
import type { Lembaga } from '~/types/lembaga';

// Assets Import
import LogoAnmategra from '/public/images/logo/anmategra-logo-full.png';

type SidebarItemType = {
  label: string;
  href: string;
  icon: React.ReactElement;
};

type SidebarProfileData = {
  id: string;
  name: string;
  profilePicture: string;
  label: string;
  href: string;
};

const SIDEBAR_ITEMS_LEMBAGA: SidebarItemType[] = [
  { label: 'Beranda', href: '/lembaga', icon: <HomeIcon /> },
  { label: 'Kegiatan', href: '/lembaga/kegiatan', icon: <CalendarIcon /> },
  { label: 'Anggota', href: '/lembaga/anggota', icon: <PersonIcon /> },
  { label: 'Inbox', href: '/lembaga/inbox', icon: <EnvelopeOpenIcon /> },
  {
    label: 'Laporan',
    href: '/lembaga/laporan',
    icon: <ExclamationTriangleIcon />,
  },
];

const SIDEBAR_ITEMS_MAHASISWA: SidebarItemType[] = [
  { label: 'Beranda', href: '/mahasiswa', icon: <HomeIcon /> },
  {
    label: 'Laporan',
    href: '/mahasiswa/laporan',
    icon: <ExclamationTriangleIcon />,
  },
  { label: 'Inbox', href: '/mahasiswa/inbox', icon: <EnvelopeOpenIcon /> },
];

export const Sidebar = ({ session }: { session: Session | null }) => {
  const user = session?.user;
  const role = user?.role ?? 'mahasiswa';

  const sidebarItems =
    role === 'lembaga' ? SIDEBAR_ITEMS_LEMBAGA : SIDEBAR_ITEMS_MAHASISWA;

  let profileData: SidebarProfileData;
  if (role === 'lembaga') {
    const lembaga: Lembaga = {
      id: user?.lembagaId ?? '',
      name: user?.name ?? '',
      profilePicture: user?.image ?? '',
    };
    profileData = {
      id: lembaga.id ?? '',
      name: lembaga.name,
      profilePicture: lembaga.profilePicture ?? '',
      label: 'Lembaga',
      href: `/lembaga/profile-lembaga/${lembaga.id ?? ''}`,
    };
  } else {
    profileData = {
      id: user?.id ?? '',
      name: user?.name ?? '',
      profilePicture: user?.image ?? '',
      label: 'Mahasiswa',
      href: `/mahasiswa/profile-mahasiswa/${user?.id ?? ''}`,
    };
  }

  return (
    <>
      <div className="ml-[16rem]" />
      <div className="w-[16rem] border-r bg-neutral-50 p-6 fixed left-0 h-screen">
        <nav className="w-full h-full flex flex-col justify-between">
          <div className="space-y-[32px]">
            <Link href={'/'}>
              <Image
                src={LogoAnmategra}
                alt="Logo Anmategra"
                width={150}
                height={50}
                style={{ width: 'auto', height: 'auto' }}
                priority
              />
            </Link>
            <SidebarItems items={sidebarItems} />
          </div>
          <SidebarProfile profile={profileData} />
        </nav>
      </div>
    </>
  );
};

const SidebarItems = ({ items }: { items: SidebarItemType[] }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-[16px]">
      {items.map((item) => (
        <Button
          key={item.href}
          className="flex items-center justify-start px-4 hover:bg-[#DFE7EC] hover:text-[#2B6282] rounded-[8px] text-[#636A6D] text-[18px]"
          variant="ghost"
          asChild
        >
          <Link
            href={item.href}
            className={cn(
              pathname === item.href && 'bg-[#DFE7EC] text-[#2B6282]',
            )}
          >
            <div className="flex flex-row items-center gap-[12px]">
              {item.icon}
              {item.label}
            </div>
          </Link>
        </Button>
      ))}
    </div>
  );
};

const SidebarProfile = ({ profile }: { profile: SidebarProfileData }) => {
  return (
    <div className="flex w-full flex-col gap-y-2">
      <Link href={profile.href}>
        <div className="flex items-center gap-4 px-1 py-2">
          <Avatar>
            <AvatarImage
              className="object-contain"
              src={profile.profilePicture ?? ''}
            />
            <AvatarFallback>{profile.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="line-clamp-1 font-semibold p-0 m-0 -translate-x-2 text-[18px]">
                  {profile.name}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{profile.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="line-clamp-1 text-xs text-neutral-700 text-[16px]">
              {profile.label}
            </span>
          </div>
        </div>
      </Link>
      <Button
        variant="warning"
        className="flex items-center justify-start gap-3 bg-transparent px-3 py-2 text-base text-destructive shadow-none hover:text-destructive-foreground"
        onClick={async () => {
          await signOut({ callbackUrl: '/' });
        }}
      >
        <LogOut /> Keluar
      </Button>
    </div>
  );
};
