// Library Import
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import CarouselBestStaff from '~/app/_components/carousel/carousel-best-staff';
// Components Import
import { EventHeader } from '~/app/_components/placeholder/event-header';
import { PenyelenggaraCard } from '~/app/_components/placeholder/penyelenggara-card';
import ProfileKegiatanComp from '~/app/_components/profile-kegiatan/profil-kegiatan-comp';
import { Button } from '~/components/ui/button';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';

const ProfileKegiatan = async ({
  params,
}: {
  params: Promise<{ profileKegiatanId: string }>;
}) => {
  const query = (await params).profileKegiatanId;
  const { kegiatan, lembaga, participant } = await api.profile.getKegiatan({
    kegiatanId: query,
  });
  const session = await getServerAuthSession();
  const is_user_owner = session?.user?.lembagaId === lembaga?.id;

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
    latestBestStaff = await api.lembaga.getLatestBestStaffKegiatan({
      event_id: query,
    });
    console.log('Best staff data loaded for kegiatan:', latestBestStaff);
  } catch (error) {
    console.log('No best staff data available for kegiatan:', query, error);
  }

  return (
    <div className="w-full flex min-h-screen flex-col items-center px-6">
      <div className="w-full max-w-7xl bg-slate-50 py-6">
        <div className="mb-4">
          <h1 className="text-xl md:text-2xl font-semibold text-slate-600">Kegiatan</h1>
        </div>
        <EventHeader
          title={kegiatan?.name ?? 'null'}
          organizer={lembaga?.name ?? 'null'}
          backgroundImage={
            kegiatan?.background_image ??
            '/images/placeholder/profile-kegiatan-placeholder/kegiatan-header-background.png'
          }
          logoImage={
            kegiatan?.image ??
            '/images/placeholder/profile-kegiatan-placeholder/oskm-header.png'
          }
          ajuanAsosiasi={Boolean(kegiatan?.id)}
          session={session}
        />
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-semibold text-slate-600">
              Penyelenggara
            </h2>
          </div>
          <Link href={`/profile-lembaga/${lembaga?.id}`}>
            <PenyelenggaraCard
              title={lembaga?.name ?? 'Tidak ada nama'}
              category={lembaga?.type ?? 'Tidak ada kategori'}
              logo={
                lembaga?.image ??
                '/images/placeholder/profile-kegiatan-placeholder/oskm-organizer.png'
              }
            />
          </Link>
        </div>

        {/* Best Staff Section */}
        {latestBestStaff && (
          <div className="flex flex-col gap-12 w-full mb-8">
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-2xl font-semibold text-[##141718]">
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
                {is_user_owner && (
                  <Button asChild variant="ghost">
                    <Link
                      href={`/profile-lembaga/${lembaga?.id}/histori`}
                      className="flex items-center gap-2 text-lg"
                    >
                      <span>Lihat Histori</span>
                      <ChevronRight
                        className="!w-4 !h-4 text-slate-600"
                        aria-hidden
                      />
                    </Link>
                  </Button>
                )}
              </div>
              <CarouselBestStaff
                bestStaffList={latestBestStaff.best_staff_list}
                isLembaga={true}
              />
            </div>
          </div>
        )}

        <ProfileKegiatanComp anggota={participant ?? []} session={session} />
      </div>
    </div>
  );
};

export default ProfileKegiatan;
