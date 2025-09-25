// Libray Import
// Icons Import
import { CalendarIcon } from 'lucide-react';
import { Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
// Asset Import
import DummyFotoLembaga from 'public/images/logo/hmif-logo.png';
import DummyFotoEvent from 'public/images/placeholder/kegiatan-thumbnail.png';
import LogoHMIFKecil from 'public/images/placeholder/logo-hmif.png';
import React from 'react';
import { KepanitiaanCard } from '~/app/_components/card/kepanitiaan-card';
import ProfileKegiatanComp from '~/app/_components/profile-kegiatan/profil-kegiatan-comp';
import EditProfileLembaga from '~/app/lembaga/profile-lembaga/_components/edit-profil-lembaga';
import { Badge } from '~/components/ui/badge';
// Components Import
import { Card } from '~/components/ui/card';
import { getServerAuthSession } from '~/server/auth';
// Icon Import
// TRPC Import
import { api } from '~/trpc/server';

import CarouselBestStaff from '../../../_components/carousel/carousel-best-staff';
// Dummy Data Import
import {
  dummyDate,
  dummyMahasiswaList,
} from './histori/_components/dummy-histori';

const DetailLembagaPage = async ({
  params,
}: {
  params: Promise<{ lembagaId: string }>;
}) => {
  const session = await getServerAuthSession();
  const lembagaId = (await params).lembagaId;
  const { lembagaData, newestEvent, highlightedEvent, anggota } =
    await api.profile.getLembaga({ lembagaId: lembagaId });
  const is_user_owner = lembagaData?.users.id === session?.user?.id;

  return (
    <div className="w-full flex min-h-screen flex-col items-center px-6">
      <div className="flex max-w-7xl w-full flex-col gap-4 py-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-slate-600">Beranda</h1>
          <p className="text-slate-400">Beranda / Nama Lembaga</p>
        </div>
        <div className="w-full flex items-center justify-center gap-x-10 py-12 transition-all duration-500 ease-in-out min-w-[500px]">
          <Image
            src={lembagaData?.users.image ?? DummyFotoLembaga}
            alt="Foto Lembaga"
            width={200}
            height={100}
            className="rounded-full"
          />
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-3xl text-slate-600 font-semibold">
                {lembagaData?.name}
              </p>
              <p className="text-xl text-slate-400">
                {lembagaData?.description}
              </p>
            </div>
            {is_user_owner && <EditProfileLembaga lembagaData={lembagaData} />}
          </div>
        </div>

        {/* Highlighted Event */}
        {highlightedEvent && (
          <div className="flex flex-col w-full gap-4">
            <h5 className="text-[24px] leading-[32px] font-semibold text-[#000000]">
              Highlighted Event
            </h5>

            <Link href={`/lembaga/profile-kegiatan/${highlightedEvent.id}`}>
              <Card className="flex flex-row items-center w-full max-w-7xl h-[180px] border-[0.86px] border-[#C4CACE] rounded-[28px] overflow-hidden bg-white transition-all hover:shadow-md">
                {/* Poster Event */}
                <Image
                  src={highlightedEvent.image ?? DummyFotoEvent}
                  alt="Poster Event Highlight"
                  width={210}
                  height={180}
                  className="object-cover flex-none"
                />

                {/* Info Content */}
                <div className="flex flex-col justify-center items-start px-[30.96px] gap-[10.32px] flex-1 h-[122.4px] bg-white">
                  {/* Badge & Jumlah Peserta */}
                  <div className="flex flex-row justify-between items-center w-full">
                    <Badge className="flex flex-row items-center gap-[6.88px] bg-[#2B6282] py-[3.44px] px-[10.32px] rounded-[13.76px]">
                      <Image
                        src={lembagaData?.users.image ?? LogoHMIFKecil}
                        alt="Logo Lembaga"
                        width={21}
                        height={21}
                        className="rounded-full object-cover"
                      />
                      <p className="text-[12px] leading-[16px] font-bold text-white">
                        {lembagaData?.name}
                      </p>
                    </Badge>

                    <div className="flex flex-row items-center gap-[6.88px] text-[#768085] text-[14px] leading-[20px]">
                      <Users
                        width={21}
                        height={21}
                        className="fill-current text-[#768085]"
                      />
                      <p className="font-normal">
                        {highlightedEvent.participant_count}
                      </p>
                    </div>
                  </div>

                  {/* Judul & Deskripsi */}
                  <div className="flex flex-col gap-[6.88px] w-full">
                    <p className="text-[18px] font-bold leading-[26px] text-[#2B6282]">
                      {highlightedEvent.name}
                    </p>
                    <p className="text-[14px] leading-[20px] text-[#1E1E1E] line-clamp-1">
                      {highlightedEvent.description}
                    </p>
                  </div>

                  {/* Tanggal */}
                  <div className="flex flex-row items-center gap-[6.88px] text-[14px] leading-[20px] text-[#768085]">
                    <CalendarIcon width={21} height={21} />
                    <p>
                      {highlightedEvent.start_date.toLocaleDateString('id-ID', {
                        month: 'short',
                        year: 'numeric',
                      })}{' '}
                      -{' '}
                      {highlightedEvent.end_date?.toLocaleDateString('id-ID', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-12 w-full">
          {dummyDate.slice(0, 1).map((item, id) => (
            <div key={id} className="flex flex-col gap-3 w-full">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-2xl font-semibold">
                  Best Staff Periode {item.startDate}–{item.endDate} 2025
                </h2>
              </div>
              <CarouselBestStaff />
            </div>
          ))}
        </div>

        {/* Kepanitiaan Terbaru */}
        <div className="space-y-4 pb-12">
          <h5 className="text-2xl font-semibold text-slate-600">
            Kepanitiaan Terbaru
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {newestEvent && newestEvent.length !== 0 ? (
              newestEvent.map((item) => (
                <Link
                  href={`/lembaga/profile-kegiatan/${item.id}`}
                  key={item.id}
                >
                  <KepanitiaanCard kepanitiaan={item} />
                </Link>
              ))
            ) : (
              <p className="text-slate-600">Belum ada kepanitiaan</p>
            )}
          </div>
        </div>
        <ProfileKegiatanComp anggota={anggota ?? []} />
      </div>
    </div>
  );
};

export default DetailLembagaPage;
