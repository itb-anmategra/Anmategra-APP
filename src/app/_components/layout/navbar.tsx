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
import { api } from '~/trpc/react';

import { Sidebar as Sidebars } from './sidebar';
// Assets Import
import LogoAnmategra from '/public/images/logo/anmategra-logo.png';

type SidebarProps = {
  session: Session | null;
  onClose?: () => void;
};

const Sidebar = Sidebars as (props: SidebarProps) => JSX.Element;

const Navbar = ({ session }: { session: Session | null }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  const lembagaInfo = api.lembaga.getInfo.useQuery(
    { lembagaId: session?.user.lembagaId ?? '' },
    { enabled: session?.user.role === 'lembaga' && !!session?.user.lembagaId },
  ).data;

  const user = api.users.getMahasiswaById.useQuery(
    { userId: session?.user.id ?? '' },
    { enabled: !!session?.user.id },
  ).data?.mahasiswaData.user;

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

          <div className="hidden sm:block w-full bg-white border-b border-neutral-50">
            <div className="flex items-center justify-between max-w-[1440px] mx-auto py-3 px-6 lg:py-4 lg:px-12">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setIsSideBarOpen(true)}
                  variant="ghost"
                  size="icon"
                  className="w-9 h-9"
                >
                  <Menu className="w-5 h-5" />
                </Button>

                <Link href="/lembaga" className="flex-shrink-0">
                  <Image
                    src={LogoAnmategra}
                    alt="Logo Anmategra"
                    width={48}
                    height={48}
                  />
                </Link>
              </div>

              <div className="flex items-center w-full flex-1 max-w-2xl h-12 mx-4 bg-white border border-[#C4CACE] rounded-full py-2 px-4 gap-2">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />

                <Input
                  placeholder="Pencarian Lembaga, Kegiatan, atau Mahasiswa"
                  className="w-full h-full bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 font-normal text-base text-[#636A6D]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <nav className="flex items-center flex-shrink-0">
                <Link
                  href={
                    lembagaInfo?.id
                      ? `/profile-lembaga/${lembagaInfo.id}`
                      : '/lembaga'
                  }
                >
                  {lembagaInfo?.foto || session?.user.image ? (
                    <Image
                      src={lembagaInfo?.foto ?? session?.user.image ?? ''}
                      alt="Profile User"
                      width={40}
                      height={40}
                      className="rounded-full object-cover w-[40px] h-[40px]"
                    />
                  ) : (
                    <Image
                      src={ProfilePic}
                      alt="Default Profile"
                      width={40}
                      height={40}
                      className="rounded-full object-cover w-[40px] h-[40px]"
                    />
                  )}
                </Link>
              </nav>
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
          {/* Mobile Navbar */}
          <div className="sm:hidden w-full bg-white border-b border-neutral-50 fixed top-0 left-0 right-0 z-30">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                {session && (
                  <Button
                    onClick={() => setIsSideBarOpen(true)}
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                )}
                
                <Link href={session ? '/mahasiswa' : '/'} className="flex-shrink-0">
                  <Image
                    src={LogoAnmategra}
                    alt="Logo Anmategra"
                    width={40}
                    height={40}
                    priority
                  />
                </Link>
              </div>

              <div className='flex items-center gap-2'>
                <Button
                  onClick={() => setIsSearchOpen(true)}
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                >
                  <Search className="w-5 h-5" />
                </Button>

                {session && (
                  <Link href={`/mahasiswa/profile-mahasiswa/${session.user.id}`}>
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt="Profile User"
                        width={36}
                        height={36}
                        className="rounded-full object-cover w-[36px] h-[36px]"
                      />
                    ) : (
                      <Image
                        src={ProfilePic}
                        alt="Default Profile"
                        width={36}
                        height={36}
                        className="rounded-full object-cover w-[36px] h-[36px]"
                      />
                    )}
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Overlay */}
          {isSearchOpen && (
            <div className="sm:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
              <div className="flex items-center px-4 py-3 border-b border-neutral-50">
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

          {/* Desktop Navbar */}
          <div className='hidden sm:block w-full bg-white border-b border-neutral-50'>
            <div className="flex items-center justify-between max-w-[1440px] mx-auto py-3 px-6 lg:py-4 lg:px-12">

              {/* Logo Anmategra */}
              {session ? (
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setIsSideBarOpen(true)}
                    variant="ghost"
                    size="icon"
                    className="w-9 h-9"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>

                  <Link href={'/'}>
                    <Image
                      src={LogoAnmategra}
                      alt="Logo Anmategra"
                      width={48}
                      height={48}
                    />
                  </Link>
                </div>
              ) : (
                <div className="flex items-center">
                  <Link href={'/'}>
                    <Image
                      src={LogoAnmategra}
                      alt="Logo Anmategra"
                      width={48}
                      height={48}
                    />
                  </Link>
                </div>
              )}

              {/* Input Search */}
              <div className="flex items-center w-full flex-1 max-w-2xl h-12 mx-4 bg-white border border-[#C4CACE] rounded-full py-2 px-4 gap-2">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />

                <Input
                  placeholder="Pencarian Lembaga, Kegiatan, atau Mahasiswa"
                  className="w-full h-full bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 font-normal text-base text-[#636A6D]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              {/* Profil */}
              <nav className="flex items-center flex-shrink-0">
                {session ? (
                  <Link href={`/mahasiswa/profile-mahasiswa/${session.user.id}`}>
                    {user?.image ? (
                      <Image
                        src={user.image}
                        alt="Profile User"
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-[40px] h-[40px]"
                      />
                    ) : (
                      <Image
                        src={ProfilePic}
                        alt="Default Profile"
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-[40px] h-[40px]"
                      />
                    )}
                  </Link>
                ) : (
                  <Link href={'/authentication'}>
                    <Button
                      className="h-10 px-6 py-2 rounded-xl bg-[#00B7B7] text-white hover:bg-secondary-500 font-semibold text-lg"
                    >
                      Login
                    </Button>
                  </Link>
                )}
              </nav>
            </div>
          </div>

        </>
      )}
      {isSideBarOpen && session && (
        <>
          {/* Background overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setIsSideBarOpen(false)}
          />

          {/* Sidebar drawer */}
          <Sidebar
            session={session}
            onClose={() => setIsSideBarOpen(false)}
          />
        </>
      )}
    </>
  );
};

export default Navbar;
