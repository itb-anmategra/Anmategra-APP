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
import { LogOut, X } from 'lucide-react';
// Auth Import
import { type Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
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
import { api } from '~/trpc/react';
// Type Import

// Assets Import
import LogoAnmategraFull from '/public/images/logo/anmategra-logo-full.png';
import LogoAnmategra from '/public/images/logo/anmategra-logo.png';

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

export const Sidebar = ({
  session,
  isMobileOpen,
  onMobileClose,
}: {
  session: Session | null;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}) => {
  const user = session?.user;
  const role = user?.role ?? 'mahasiswa';
  const isMobileSidebarOpen = isMobileOpen ?? false;
  const setIsMobileSidebarOpen = (open: boolean) => {
    if (!open && onMobileClose) {
      onMobileClose();
    }
  };

  const sidebarItems =
    role === 'lembaga' ? SIDEBAR_ITEMS_LEMBAGA : SIDEBAR_ITEMS_MAHASISWA;

  let profileData: SidebarProfileData;
  if (role === 'lembaga') {
    const lembaga = api.lembaga.getInfo.useQuery({
      lembagaId: user?.lembagaId ?? '',
    }).data;

    profileData = {
      id: lembaga?.id ?? '',
      name: lembaga?.nama ?? '',
      profilePicture: lembaga?.foto ?? '',
      label: 'Lembaga',
      href: `/profile-lembaga/${lembaga?.id ?? ''}`,
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
      <div
        className={cn(
          role === 'lembaga' ? 'hidden sm:block sm:w-20 lg:w-64' : 'w-64',
        )}
      />

      <div
        className={cn(
          'border-r bg-neutral-50 fixed left-0 h-screen transition-all duration-300',
          role === 'lembaga'
            ? 'hidden sm:flex sm:w-20 lg:w-64 sm:p-3 lg:p-6'
            : 'w-64 p-6',
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
                src={LogoAnmategraFull}
                alt="Logo Anmategra"
                width={150}
                height={50}
                className={cn(role === 'lembaga' ? 'hidden lg:block' : 'block')}
                style={{ width: 'auto', height: 'auto' }}
                priority
              />
              {role === 'lembaga' && (
                <Image
                  src={LogoAnmategra}
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

      {/* Mobile Sidebar for Lembaga - Opens from right */}
      {role === 'lembaga' && isMobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 sm:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          <div className="fixed top-0 right-0 h-full w-64 bg-neutral-50 shadow-lg z-[60] border-l sm:hidden">
            <nav className="w-full h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                <Link
                  href="/lembaga"
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <Image
                    src={LogoAnmategraFull}
                    alt="Logo Anmategra"
                    width={120}
                    height={40}
                    style={{ width: 'auto', height: 'auto' }}
                    priority
                  />
                </Link>
                <Button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1 p-4">
                <div className="flex flex-col gap-2">
                  {sidebarItems.map((item) => (
                    <Button
                      key={item.href}
                      className={cn(
                        'flex items-center justify-start h-12 px-4 hover:bg-[#DFE7EC] hover:text-[#2B6282] rounded-[8px] text-[#636A6D] text-[16px]',
                        usePathname() === item.href &&
                          'bg-[#DFE7EC] text-[#2B6282]',
                      )}
                      variant="ghost"
                      asChild
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileSidebarOpen(false)}
                      >
                        <div className="flex flex-row items-center gap-3">
                          <span className="w-5 h-5">{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-neutral-200">
                <div className="flex flex-col gap-3">
                  <Link
                    href={profileData.href}
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    <div className="flex items-center gap-3 p-2 hover:bg-[#DFE7EC] rounded-lg transition-colors">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage
                          className="object-contain"
                          src={profileData.profilePicture ?? ''}
                        />
                        <AvatarFallback>
                          {profileData.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-0 min-w-0">
                        <p className="font-semibold text-[16px] line-clamp-1">
                          {profileData.name}
                        </p>
                        <span className="text-xs text-neutral-700">
                          {profileData.label}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <Button
                    variant="warning"
                    className="flex items-center justify-start gap-3 bg-transparent py-2 px-3 text-base text-destructive shadow-none hover:text-destructive-foreground hover:bg-red-50"
                    onClick={async () => {
                      setIsMobileSidebarOpen(false);
                      await signOut({ callbackUrl: '/' });
                    }}
                  >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    <span>Keluar</span>
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

// Export function to control sidebar from navbar
export const useSidebarControl = () => {
  const [isOpen, setIsOpen] = useState(false);
  return { isOpen, setIsOpen };
};

const SidebarItems = ({
  items,
  role,
  onItemClick,
}: {
  items: SidebarItemType[];
  role: string;
  onItemClick?: () => void;
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
                  onClick={onItemClick}
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
  onProfileClick,
}: {
  profile: SidebarProfileData;
  role: string;
  onProfileClick?: () => void;
}) => {
  return (
    <div className="flex w-full flex-col gap-y-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={profile.href} onClick={onProfileClick}>
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
