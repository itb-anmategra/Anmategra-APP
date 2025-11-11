// Libray Import
// Icons Import
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
// Asset Import
import DummyFotoLembaga from 'public/images/logo/hmif-logo.png';
import React from 'react';
import { KepanitiaanCard } from '~/app/_components/card/kepanitiaan-card';
import ProfileKegiatanComp from '~/app/_components/profile-kegiatan/profil-kegiatan-comp';
import EditProfileLembaga from '~/app/lembaga/profile-lembaga/_components/edit-profil-lembaga';
import { Button } from '~/components/ui/button';
// Components Import
import { getServerAuthSession } from '~/server/auth';
// Icon Import
// TRPC Import
import { api } from '~/trpc/server';

import CarouselBestStaff from '../../../_components/carousel/carousel-best-staff';
import HighlightedEventCard from '../_components/highlighted-event-card';
// Dummy Data Import
import { dummyDate } from './histori/_components/dummy-histori';

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
          <div className="flex flex-col w-full gap-4 mb-8">
            <h5 className="text-[24px] leading-[32px] font-semibold text-[#000000]">
              Highlighted Event
            </h5>

            <HighlightedEventCard
              event={highlightedEvent}
              lembagaData={lembagaData}
            />
          </div>
        )}

        <div className="flex flex-col gap-12 w-full mb-8">
          {dummyDate.slice(0, 1).map((item, id) => (
            <div key={id} className="flex flex-col gap-3 w-full">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-2xl font-semibold">
                  Best Staff Periode {item.startDate}–{item.endDate} 2025
                </h2>
                {is_user_owner && (
                  <Button asChild variant="ghost">
                    <Link
                      href={`/lembaga/profile-lembaga/${lembagaId}/histori`}
                      className="flex items-center gap-2 text-lg"
                    >
                      <span>Lihat Histori </span>
                      <ChevronRight
                        className="!w-4 !h-4 text-slate-1000"
                        aria-hidden
                      />
                    </Link>
                  </Button>
                )}
              </div>
              <CarouselBestStaff />
            </div>
          ))}
        </div>

        {/* Kepanitiaan Terbaru */}
        <div className="space-y-4">
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
