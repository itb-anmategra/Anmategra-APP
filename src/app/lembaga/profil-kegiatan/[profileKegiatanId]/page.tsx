// Library Import
import Link from 'next/link';
import React from 'react';
// Components Import
import { EventHeader } from '~/app/_components/placeholder/event-header';
import { PenyelenggaraCard } from '~/app/_components/placeholder/penyelenggara-card';
import ProfileKegiatanComp from '~/app/_components/profil-kegiatan/profil-kegiatan-comp';
import { api } from '~/trpc/server';

const ProfileKegiatan = async ({
  params,
}: {
  params: Promise<{ profileKegiatanId: string }>;
}) => {
  const query = (await params).profileKegiatanId;
  const { kegiatan, lembaga, participant } = await api.profil.getKegiatan({
    kegiatanId: query,
  });

  return (
    <div className="w-full flex min-h-screen flex-col items-center px-6">
      <div className="w-full max-w-7xl bg-slate-50 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-slate-600">Kegiatan</h1>
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
        />
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-600">
            Penyelenggara
          </h2>
        </div>
        <Link href={`/lembaga/profil-lembaga/${lembaga?.id}`}>
          <PenyelenggaraCard
            title={lembaga?.name ?? 'Tidak ada nama'}
            category={lembaga?.type ?? 'Tidak ada kategori'}
            logo={
              lembaga?.image ??
              '/images/placeholder/profile-kegiatan-placeholder/oskm-organizer.png'
            }
          />
        </Link>
        <ProfileKegiatanComp anggota={participant ?? []} />
      </div>
    </div>
  );
};

export default ProfileKegiatan;
