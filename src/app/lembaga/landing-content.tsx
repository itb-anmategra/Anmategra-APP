'use client';

// Library Import
// Icons Import
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
// Auth Import
import { type Session } from 'next-auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
// Components Import
import { Input } from '~/components/ui/input';
// Types Import
import { type Kepanitiaan } from '~/types/kepanitiaan';

import { KepanitiaanCard } from '../_components/card/kepanitiaan-card';

export default function LandingContent({
  data,
}: {
  data: {
    kegiatanTerbaru: Kepanitiaan[];
    kegiatanTerbesar: Kepanitiaan[];
  };
  session: Session | null;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      void router.push(`/lembaga/pencarian/${searchQuery}`);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 p-6">
      {/* Title and Search */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-slate-600">Beranda</h1>
        <Input
          placeholder="Cari lembaga, kegiatan, atau mahasiswa"
          className="rounded-2xl bg-white placeholder:text-neutral-700 focus-visible:ring-transparent"
          startAdornment={
            <MagnifyingGlassIcon className="size-4 text-gray-500" />
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* List of Kepanitiaan */}
      <div className="flex flex-col w-full gap-y-8">
        {/*/!* Kepanitiaan *!/*/}
        {/*<div className="space-y-2 w-full">*/}
        {/*    <h3 className="text-left text-xl font-semibold mb-2 text-slate-600">Kepanitiaan</h3>*/}
        {/*    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-4">*/}
        {/*        {data.kepanitiaanTerbaru.length !== 0 && data.kepanitiaanTerbaru.map((kepanitiaan) => (*/}
        {/*            <Link */}
        {/*                key={kepanitiaan.name} */}
        {/*                href={`/lembaga/profil-lembaga/${kepanitiaan.lembaga.id}`}*/}
        {/*            >*/}
        {/*                <KepanitiaanCard*/}
        {/*                    kepanitiaan={kepanitiaan}*/}
        {/*                />*/}
        {/*            </Link>*/}
        {/*        ))}*/}
        {/*        {!data.kepanitiaanTerbaru || data.kepanitiaanTerbaru.length === 0 && (*/}
        {/*            <div>*/}
        {/*                <p className="text-slate-600">Tidak ada kepanitiaan terbaru.</p>*/}
        {/*            </div>*/}
        {/*        )}*/}
        {/*    </div>*/}
        {/*</div>*/}
        {/* Kegiatan */}
        <div className="space-y-2 w-full">
          <h3 className="text-left text-xl font-semibold mb-2 text-slate-600">
            Kegiatan terbaru
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-4">
            {data.kegiatanTerbaru.length !== 0 &&
              data.kegiatanTerbaru.map((kepanitiaan) => (
                <Link
                  key={kepanitiaan.name}
                  href={`/lembaga/profile-kegiatan/${kepanitiaan.id}`}
                >
                  <KepanitiaanCard kepanitiaan={kepanitiaan} />
                </Link>
              ))}
            {!data.kegiatanTerbaru ||
              (data.kegiatanTerbaru.length === 0 && (
                <div>
                  <p className="text-slate-600">Tidak ada kegiatan terbaru.</p>
                </div>
              ))}
          </div>
        </div>
        {/* Kepanitiaan Terbesar */}
        <div className="space-y-2 w-full">
          <h3 className="text-left text-xl font-semibold mb-2 text-slate-600">
            Kegiatan Terbesar
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 mb-4">
            {data.kegiatanTerbesar.length !== 0 &&
              data.kegiatanTerbesar.map((kepanitiaan) => (
                <Link
                  key={kepanitiaan.name}
                  href={`/lembaga/profile-kegiatan/${kepanitiaan.id}`}
                >
                  <KepanitiaanCard kepanitiaan={kepanitiaan} />
                </Link>
              ))}
            {!data.kegiatanTerbesar ||
              (data.kegiatanTerbesar.length === 0 && (
                <div>
                  <p className="text-slate-600">
                    Tidak ada Kegiatan terbesar yang dapat ditampilkan.
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
