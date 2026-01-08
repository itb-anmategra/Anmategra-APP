// Libray Import
// Icons Import
import { CalendarIcon, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import CarouselBestStaff from '~/app/_components/carousel/carousel-best-staff';
import { Button } from '~/components/ui/button';
// Asset Import
import DummyFotoLembaga from 'public/images/logo/hmif-logo.png';
import DummyFotoEvent from 'public/images/placeholder/kegiatan-thumbnail.png';
import LogoHMIFKecil from 'public/images/placeholder/logo-hmif.png';
import React from 'react';
import { KepanitiaanCard } from '~/app/_components/card/kepanitiaan-card';
import ProfileKegiatanComp from '~/app/_components/profile-kegiatan/profil-kegiatan-comp';
import { Badge } from '~/components/ui/badge';
import { RaporBreadcrumb } from '~/app/_components/breadcrumb';
// Components Import
import { Card } from '~/components/ui/card';
// TRPC Import
import { api } from '~/trpc/server';
import { getServerAuthSession } from '~/server/auth';

const DetailLembagaPage = async ({
  params,
}: {
  params: Promise<{ lembagaId: string }>;
}) => {
  const lembagaId = (await params).lembagaId;
  const { lembagaData, newestEvent, highlightedEvent, anggota } =
    await api.profile.getLembaga({ lembagaId: lembagaId });

  const session = await getServerAuthSession();

  let latestBestStaff: {
    start_date: string;
    end_date: string;
    best_staff_list: {
      user_id: string;
      name: string;
      image: string | null;
      nim: string;
      jurusan: string;
      division: string;
    }[];
  } | null = null;
  try {
    latestBestStaff = await api.lembaga.getLatestBestStaffLembaga({
      lembaga_id: lembagaId,
    });
  } catch (error) {
    console.log('No best staff data available for lembaga:', lembagaId, error);
  }
  return (
    <>
      <div className="w-full flex min-h-screen flex-col items-center px-[14px]">
        <div className="flex max-w-7xl w-full flex-col gap-4 py-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-slate-600">Lembaga</h1>
            <RaporBreadcrumb
              items={[
                { label: 'Beranda', href: '/' },
                { label: 'Profil Lembaga', href: `/profile-lembaga/${lembagaId}` },
              ]}
            />
          </div>
            <div className="w-full flex items-center justify-center gap-6 sm:py-12">
            <Image
              src={lembagaData?.users.image ?? DummyFotoLembaga}
              alt="Foto Lembaga"
              width={200}
              height={100}
              className="rounded-full w-32 h-32 md:w-48 md:h-48 object-cover"
            />
            <div className="space-y-1">
              <p className="text-xl sm:text-2xl md:text-3xl text-slate-600 font-semibold">
              {lembagaData?.name}
              </p>
              <p className="text-sm sm:text-lg md:text-xl text-slate-400">
              {lembagaData?.description}
              </p>
            </div>
            </div>

          {highlightedEvent && (
            <Link href={`/mahasiswa/profile-kegiatan/${highlightedEvent.id}`}>
              <div className="space-y-4 pb-12">
                <h5 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-600">
                  Highlighed Event
                </h5>
                <Card className="transition-all hover:shadow-md overflow-x-hidden flex justify-start gap-x-6 items-center">
                  <Image
                    src={highlightedEvent?.image ?? DummyFotoEvent}
                    alt="Foto Kegiatan"
                    className="h-full w-auto"
                    width={200}
                    height={100}
                  />
                  <div className="space-y-2">
                    <Badge className="space-x-2 rounded-full bg-Blue-Dark py-1">
                      <Image
                        src={lembagaData?.users.image ?? LogoHMIFKecil}
                        alt="Logo HMIF Kecil"
                        width={20}
                        height={20}
                        className="rounded-full object-cover"
                      />
                      <p className="text-xs">{lembagaData?.name}</p>
                    </Badge>
                    <p className="text-xl text-Blue-Dark font-semibold">
                      {highlightedEvent?.name}
                    </p>
                    <p className="text-neutral-1000">
                      {highlightedEvent?.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-Regent-Gray">
                      <CalendarIcon className="h-4 w-4" />
                      {highlightedEvent?.start_date.toDateString()} -{' '}
                      {highlightedEvent?.end_date?.toDateString()}
                    </div>
                  </div>
                </Card>
              </div>
            </Link>
          )}

          {/* Best Staff Section */}
          {latestBestStaff && (
            <div className="flex flex-col gap-12 w-full pb-12">
              <div className="flex flex-col gap-3 w-full">
                <div className="flex flex-row justify-between items-center">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-600">
                    Best Staff Periode{' '}
                    {new Date(latestBestStaff.start_date).toLocaleDateString(
                      'id-ID',
                      {
                        month: 'long',
                        year: 'numeric',
                      },
                    )}
                    –
                    {new Date(latestBestStaff.end_date).toLocaleDateString(
                      'id-ID',
                      {
                        month: 'long',
                        year: 'numeric',
                      },
                    )}
                  </h2>
                  <Button asChild variant="ghost">
                    <Link
                      href={`/mahasiswa/profile-lembaga/${lembagaId}/histori`}
                      className="flex items-center gap-2 text-lg"
                    >
                      <span>Lihat Histori</span>
                      <ChevronRight
                        className="!w-4 !h-4 text-slate-600"
                        aria-hidden
                      />
                    </Link>
                  </Button>
                </div>
                <CarouselBestStaff
                  bestStaffList={latestBestStaff.best_staff_list}
                  isLembaga={true}
                />
              </div>
            </div>
          )}

          {/* Kepanitiaan Terbaru */}
          <div className="space-y-4 sm:pb-12">
            <h5 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-600">
              Kepanitiaan Terbaru
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {newestEvent && newestEvent.length !== 0 ? (
                newestEvent.map((item) => (
                  <Link
                    href={`/profile-kegiatan/${item.id}`}
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

          {/* Anggota Section */}
          <ProfileKegiatanComp anggota={anggota ?? []} session={session} />
        </div>
      </div>
    </>
  );
};

export default DetailLembagaPage;
