'use client';

// Library Import
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
// Icon Import
import { Menu, Search, X } from 'lucide-react';
import { type Session } from 'next-auth';
// Next Auth Import
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProfilePic from 'public/images/placeholder/profile-pic.png';
import React, { useEffect, useState } from 'react';
// Components Import
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

import { Sidebar as Sidebars } from './sidebar';
// Assets Import
import LogoAnmategra from '/public/images/logo/anmategra-logo.png';

type SidebarProps = {
  session: Session | null;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
};

const Sidebar = Sidebars as (props: SidebarProps) => JSX.Element;

const Navbar = ({ session }: { session: Session | null }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  const navigateToSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    const encoded = encodeURIComponent(trimmed);
    if (session?.user.role === 'lembaga') {
      void router.push(`/lembaga/pencarian/${encoded}`);
    } else {
      void router.push(`/mahasiswa/pencarian/${encoded}`);
    }
    setIsSearchOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      navigateToSearch();
    }
  };

  // useEffect(() => {
  //   if (session?.user.role === 'lembaga') {
  //     router.push('/lembaga');
  //   }
  // });
  const handleSearchSubmit = () => {
    navigateToSearch();
    // setSearchQuery('');
  }

  useEffect(() => {
    if (session?.user.role === 'lembaga' && !window.location.pathname.startsWith('/lembaga')) {
      router.push('/lembaga');
    }
  }, [session, router]);

  return (
    <>
      {session && session.user.role === 'lembaga' ? (
        <>
          <div className="sm:hidden w-full bg-white border-b border-neutral-50 fixed top-0 left-0 right-0 z-30">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <Link href="/lembaga" className="flex-shrink-0">
                  <Image
                    src={LogoAnmategra}
                    alt="Logo Anmategra"
                    width={40}
                    height={40}
                    priority
                  />
                </Link>
              </div>

              <div className='flex items-center justify-between'>
                <Button
                  onClick={() => setIsSearchOpen(true)}
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                >
                  <Search className="w-5 h-5" />
                </Button>

                <Button
                  onClick={() => setIsSideBarOpen(true)}
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>

          {isSearchOpen && (
            <div className="sm:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
              <div className="flex items-center px-4 py-3 border-b border-neutral-50">
                {/* Back Button */}
                <Button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 mr-3"
                >
                  <X className="w-5 h-5" />
                </Button>

                <div className="flex-1 relative">
                  <Input
                    placeholder="Cari lembaga, kegiatan, atau mahasiswa"
                    className="w-full pr-10 border-0 bg-gray-50 rounded-full placeholder:text-neutral-700 focus-visible:ring-1 focus-visible:ring-[#00B7B7]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                  <Button
                    onClick={handleSearchSubmit}
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8"
                  >
                    <MagnifyingGlassIcon className="w-4 h-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className='w-full bg-white border-b border-neutral-50'>
            <div className="flex items-center justify-between max-w-[1440px] max-h-[112px]
                    py-6 pl-[50px] pr-[72px]">

              {/* Logo Anmategra */}
              {session ? (
                <div className="flex items-center max-w-[108px] min-h-[64px] gap-[20px]">
                  <Button
                    onClick={() => setIsSideBarOpen(true)}
                    variant="ghost"
                    size="icon"
                    className="w-[24px] h-[30px]"
                  >
                    <Menu className="!w-[24px] !h-[30px]" />
                  </Button>

                  <Link href={'/'}>
                    <Image
                      src={LogoAnmategra}
                      alt="Logo Anmategra"
                      width={64}
                      height={64}
                    />
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-[20px]">
                  <Link href={'/'}>
                    <Image
                      src={LogoAnmategra}
                      alt="Logo Anmategra"
                      width={64}
                      height={64}
                    />
                  </Link>
                </div>
              )}

              {/* Input Search */}
              <div
                className="flex items-center w-full max-w-3xl h-[64px] mx-4 lg:flex 
                          bg-white border border-[#C4CACE] rounded-[40px] 
                            py-4 px-6 gap-2"
              >
                {/* Icon Mangnifying Glass */}
                <MagnifyingGlassIcon className="size-6 text-gray-500 flex-shrink-0" />

                {/* Input Field */}
                <Input
                  placeholder="Pencarian Lembaga, Kegiatan, atau Mahasiswa"
                  className="w-full h-[32px] bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 
                              font-[400] text-[20px] leading-[32px] text-[#636A6D]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              {/* Profil */}
              <nav className="flex items-center justify-start w-[128px] min-h-[52px] gap-10">
                {session ? (
                  <div className="w-full items-center gap-[10px] pl-10">
                    <Link href={`/mahasiswa/profile-mahasiswa/${session.user.id}`}>
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt="Profile User"
                          width={52}
                          height={52}
                          className="rounded-full"
                        />
                      ) : (
                        <Image
                          src={ProfilePic}
                          alt="Default Profile"
                          width={52}
                          height={52}
                          className="rounded-full"
                        />
                      )}
                    </Link>
                  </div>
                ) : (
                  <Link href={'/authentication'}>
                    <Button
                      className="max-w-[128px] min-h-[48px] px-8 py-2 flex items-center justify-center gap-2
                                    rounded-[12px] bg-[#00B7B7] text-white hover:bg-secondary-500"
                    >
                      <span className="items-center font-[600] text-[24px] leading-[32px]">
                        Login
                      </span>
                    </Button>
                  </Link>
                )}
              </nav>
            </div>
          </div>

        </>
      )}
      {isSideBarOpen && session?.user.role === 'lembaga' && (
        <>
          {/* Background overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40 sm:hidden"
            onClick={() => setIsSideBarOpen(false)}
          />

          {/* Sidebar from right for lembaga mobile */}
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-[60] border-l sm:hidden">
            <Sidebar 
              session={session} 
              isMobileOpen={true}
              onMobileClose={() => setIsSideBarOpen(false)}
            />
          </div>
        </>
      )}
      {isSideBarOpen && session?.user.role === 'mahasiswa' && (
        <>
          {/* Background overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setIsSideBarOpen(false)}
          />

          {/* Sidebar from left for mahasiswa */}
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-[100] border-none">
            <Sidebar session={session} />
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
