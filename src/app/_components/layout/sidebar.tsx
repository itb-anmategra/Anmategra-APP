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
  { label: 'Beranda', href: '/', icon: <HomeIcon /> },
  { label: 'Kegiatan', href: '/kegiatan', icon: <CalendarIcon /> },
  { label: 'Anggota', href: '/anggota', icon: <PersonIcon /> },
  { label: 'Inbox', href: '/inbox', icon: <EnvelopeOpenIcon /> },
  {
    label: 'Laporan',
    href: '/laporan',
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
      href: `/profile-lembaga/${lembaga.id ?? ''}`,
    };
  } else {
    profileData = {
      id: user?.id ?? '',
      name: user?.name ?? '',
      profilePicture: user?.image ?? '',
      label: 'Mahasiswa',
      href: `/profile-mahasiswa/${user?.id ?? ''}`,
    };
  }

  return (
    <>
      <div className={cn(role === 'lembaga' ? 'w-20 lg:w-64' : 'w-64')} />

      <div
        className={cn(
          'border-r bg-neutral-50 fixed left-0 h-screen transition-all duration-300',
          role === 'lembaga' ? 'w-20 lg:w-64 p-3 lg:p-6' : 'w-64 p-6',
        )}
      >
        <nav className="w-full h-full flex flex-col justify-between">
          <div
            className={cn(
              role === 'lembaga'
                ? 'space-y-6 lg:space-y-[32px]'
                : 'space-y-[32px]',
            )}
          >
            <Link
              href={'/'}
              className={cn(
                'flex items-center',
                role === 'lembaga'
                  ? 'justify-center lg:justify-start'
                  : 'justify-start',
              )}
            >
              <Image
                src={LogoAnmategra}
                alt="Logo Anmategra"
                width={150}
                height={50}
                className={cn(role === 'lembaga' ? 'hidden lg:block' : 'block')}
                style={{ width: 'auto', height: 'auto' }}
                priority
              />
              {role === 'lembaga' && (
                <Image
                  src="/images/logo/anmategra-logo.png"
                  alt="Logo Anmategra"
                  width={40}
                  height={40}
                  className="lg:hidden"
                  style={{ width: 'auto', height: 'auto' }}
                  priority
                />
              )}
            </Link>
            <SidebarItems items={sidebarItems} role={role} />
          </div>
          <SidebarProfile profile={profileData} role={role} />
        </nav>
      </div>
    </>
  );
};

const SidebarItems = ({
  items,
  role,
}: {
  items: SidebarItemType[];
  role: string;
}) => {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        'flex flex-col',
        role === 'lembaga' ? 'gap-3 lg:gap-[16px]' : 'gap-[16px]',
      )}
    >
      {items.map((item) => (
        <TooltipProvider key={item.href}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className={cn(
                  'flex items-center h-12 hover:bg-[#DFE7EC] hover:text-[#2B6282] rounded-[8px] text-[#636A6D] text-[18px]',
                  role === 'lembaga'
                    ? 'justify-center lg:justify-start px-3 lg:px-4'
                    : 'justify-start px-4',
                )}
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
                    <span className="w-5 h-5">{item.icon}</span>
                    <span
                      className={cn(
                        role === 'lembaga' ? 'hidden lg:inline' : 'inline',
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                </Link>
              </Button>
            </TooltipTrigger>
            {role === 'lembaga' && (
              <TooltipContent side="right" className="lg:hidden">
                <p>{item.label}</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

const SidebarProfile = ({
  profile,
  role,
}: {
  profile: SidebarProfileData;
  role: string;
}) => {
  return (
    <div className="flex w-full flex-col gap-y-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={profile.href}>
              <div
                className={cn(
                  'flex items-center gap-3 lg:gap-4 px-1 py-2',
                  role === 'lembaga'
                    ? 'justify-center lg:justify-start'
                    : 'justify-start',
                )}
              >
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarImage
                    className="object-contain"
                    src={profile.profilePicture ?? ''}
                  />
                  <AvatarFallback>{profile.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    'flex flex-col gap-0 min-w-0',
                    role === 'lembaga' ? 'hidden lg:flex' : 'flex',
                  )}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="line-clamp-1 font-semibold p-0 m-0 -translate-x-2 text-[18px] text-left">
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
          </TooltipTrigger>
          {role === 'lembaga' && (
            <TooltipContent side="right" className="lg:hidden">
              <div>
                <p className="font-semibold">{profile.name}</p>
                <p className="text-xs">{profile.label}</p>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="warning"
              className={cn(
                'flex items-center gap-3 bg-transparent py-2 text-base text-destructive shadow-none hover:text-destructive-foreground',
                role === 'lembaga'
                  ? 'justify-center lg:justify-start px-2 lg:px-3'
                  : 'justify-start px-3',
              )}
              onClick={async () => {
                await signOut({ callbackUrl: '/' });
              }}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <span
                className={cn(
                  role === 'lembaga' ? 'hidden lg:inline' : 'inline',
                )}
              >
                Keluar
              </span>
            </Button>
          </TooltipTrigger>
          {role === 'lembaga' && (
            <TooltipContent side="right" className="lg:hidden">
              <p>Keluar</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
