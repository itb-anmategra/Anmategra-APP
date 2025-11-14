'use client';

// Library Import
// Icons Import
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import Link from 'next/link';
// Assets Import
import NoAnggota from 'public/images/miscellaneous/not-found-anggota.png';
import React from 'react';
// Components Import
import { Input } from '~/components/ui/input';
import type { Session } from 'next-auth';

const ProfileKegiatanComp = ({
  anggota,
  session
}: {
  anggota: {
    id: string;
    nama: string | null;
    nim: string;
    jurusan: string;
    image: string | null;
    posisi: string | null;
    divisi: string | null;
  }[];
  session?: Session | null;
}) => {
  const [search, setSearch] = React.useState<string>('');
  const [filteredAnggota, setFilteredAnggota] = React.useState<
    {
      id: string;
      nama: string | null;
      nim: string;
      jurusan: string;
      image: string | null;
      posisi: string | null;
      divisi: string | null;
    }[]
  >([]);

  React.useEffect(() => {
    setFilteredAnggota(
      anggota.filter((item) => {
        const nameMatch = item.nama
          ?.toLowerCase()
          .includes(search.toLowerCase());
        const posisiMatch = item.posisi
          ?.toLowerCase()
          .includes(search.toLowerCase());
        const divisiMatch = item.divisi
          ?.toLowerCase()
          .includes(search.toLowerCase());
        return nameMatch ?? posisiMatch ?? divisiMatch;
      }),
    );
  }, [anggota, search]);

  const isLembaga = session?.user.role === 'lembaga';

  return (
    <div>
      <div className="mb-4 sm:mt-8 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-600">Anggota</h2>
      </div>
      <div className="mb-4">
        <Input
          placeholder="Cari nama anggota"
          className="rounded-2xl bg-white focus-visible:ring-transparent placeholder:text-neutral-700"
          startAdornment={
            <MagnifyingGlassIcon className="size-4 text-gray-500" />
          }
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div>
        {filteredAnggota.length > 0 ? (
          filteredAnggota.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-4 border-b border-neutral-200"
            >
              <div className="flex items-center gap-x-4">
                <Image
                  src={item.image ?? '/images/placeholder/profile-pic.png'}
                  alt="Profile Picture"
                  className="w-12 h-12 rounded-full"
                  width={48}
                  height={48}
                />
                <div className="flex flex-col">
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                    {item.nama}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {item.nim} - {item.jurusan}
                  </p>
                  <div className="flex items-center gap-x-2">
                    <p className="text-xs sm:text-sm text-slate-600">{item.posisi}</p>
                    <p> | </p>
                    <p className="text-xs sm:text-sm text-slate-600">{item.divisi}</p>
                  </div>
                </div>
              </div>
              <div>
                <button className="text-xs sm:text-sm md:text-base text-sky-600 font-semibold">
                  <Link href={isLembaga ? `/lembaga/profile-mahasiswa/${item.id}` : `/mahasiswa/profile-mahasiswa/${item.id}`}>
                    {' '}
                    Lihat Profil
                  </Link>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full py-16 flex flex-col items-center gap-y-4">
            <Image
              src={NoAnggota}
              alt="Tidak Ada Anggota"
              width={128}
              height={128}
            />
            <div className="w-full text-center">
              <h5 className="text-2xl font-semibold text-slate-600 text-center">
                Tidak ada anggota
              </h5>
              <p className="text-slate-400 text-center">
                Maaf, belum ada anggota yang tercatat untuk kegiatan ini
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileKegiatanComp;
