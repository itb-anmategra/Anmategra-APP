'use client';

// Library Import
// Icon Import
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
// Component Import
import { Input } from '~/components/ui/input';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const q = searchQuery.trim();
      if (q.length === 0) return;
      void router.push(`/mahasiswa/pencarian/${encodeURIComponent(q)}`);
    }
  };

  return (
    <div className="relative mx-4 sm:mx-6 lg:mx-4 flex min-h-[80vh] flex-col">
      {/* Small Ellipse */}
      <Image
        src="/images/landing/Ellipse16.png"
        alt="Ellipse16"
        height={760}
        width={760}
        style={{ width: 'auto', height: 'auto' }}
        className="absolute left-1/2 top-[14%] sm:top-[19%] z-[-1] -translate-x-1/2 -translate-y-1/2 scale-[0.6] sm:scale-[0.75] md:top-[20%] md:scale-[0.7] lg:top-[31%] lg:scale-100 xl:top-[35%] xl:scale-100"
        priority
      />
      {/* Bigger Ellipse */}
      <Image
        src="/images/landing/Ellipse15.png"
        alt="Ellipse15"
        height={1140}
        width={1140}
        style={{ width: 'auto', height: 'auto' }}
        className="absolute left-1/2 top-[20%] sm:top-[25%] z-[-2] -translate-x-1/2 -translate-y-1/2 scale-[0.9] sm:scale-125 md:top-[25%] md:scale-100 lg:top-[38%] xl:top-[44%] xl:scale-100"
        priority
      />
      {/* Blue Glow */}
      <Image
        src="/images/landing/Ellipse17.png"
        alt="Glow Effect"
        width={1200}
        height={1200}
        style={{ width: 'auto', height: 'auto' }}
        className="absolute left-1/2 top-[55%] z-[-3] -translate-x-1/2 -translate-y-1/2 border-black scale-[0.85] sm:scale-100"
        priority
      />
      <div className="relative z-10">
        <div className="container mx-auto px-2 sm:px-4 pt-24 sm:pt-28 pb-12 sm:pb-20">
          <div className="flex flex-col items-center justify-center text-center gap-4 sm:gap-6">
            <h1 className="text-3xl leading-tight sm:text-5xl lg:text-7xl font-medium tracking-tight max-w-[360px] sm:max-w-none">
              Pendataan Kemahasiswaan <br />
              <span className="mt-2 sm:mt-3 bg-gradient-to-b from-[#0B5C8A] to-[#00B7B7] bg-clip-text text-transparent">
                Terintegrasi
              </span>
            </h1>

            <p className="text-base sm:text-xl text-balance px-2 sm:px-6 max-w-[360px] sm:max-w-2xl">
              Cari kegiatan, lembaga, atau anggota KM ITB yang Anda inginkan
              sekarang
            </p>

            <div className="mb-8 sm:mb-14 mt-1 sm:mt-3 w-full max-w-[320px] sm:max-w-2xl">
              <Input
                placeholder="Pencarian Lembaga, Kegiatan, atau Mahasiswa"
                className="rounded-2xl bg-white placeholder:text-neutral-700 focus-visible:ring-transparent w-full"
                startAdornment={
                  <MagnifyingGlassIcon className="size-4 text-gray-500" />
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="relative flex w-full max-w-[90%] sm:max-w-4xl items-center justify-center px-2">
              <Image
                src="/images/landing/ANGGOTA1.png"
                alt="ANGGOTA1"
                width={725}
                height={725}
                style={{ width: 'auto', height: 'auto' }}
                className="top-0 w-full max-w-[620px] sm:max-w-none rounded-3xl border-black shadow-[0px_4px_72px_0px_#3174981A]"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
