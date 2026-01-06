// Library Import
import Link from 'next/link';
import React from 'react';
// Components Import
import { EventHeader } from '~/app/_components/placeholder/event-header';
import { PenyelenggaraCard } from '~/app/_components/placeholder/penyelenggara-card';
import ProfileKegiatanComp from '~/app/_components/profile-kegiatan/profil-kegiatan-comp';
import { api } from '~/trpc/server';
import { RaporBreadcrumb } from '~/app/_components/breadcrumb';
import { getServerAuthSession } from '~/server/auth';

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

  return (
    <div>
      <div className="w-full flex min-h-screen flex-col items-center">
        <div className="w-full max-w-7xl bg-slate-50 py-6">
          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-slate-600">Kegiatan</h1>
            <RaporBreadcrumb
              items={[
                {label: 'Beranda', href: '/'},
                {label:'Profil Kegiatan', href:`/profile-kegiatan/${query}`}
              ]}
            />
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
            eventId={kegiatan?.id ?? ''}
            ajuanAsosiasi={Boolean(kegiatan?.id)}
            linkDaftar={kegiatan?.oprec_link}
            session={session}
          />
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-600">
              Penyelenggara
            </h2>
          </div>
          <Link href={`/mahasiswa/profile-lembaga/${lembaga?.id}`}>
            <PenyelenggaraCard
              title={lembaga?.name ?? 'Tidak ada nama'}
              category={lembaga?.type ?? 'Tidak ada kategori'}
              logo={
                lembaga?.image ??
                '/images/placeholder/profile-kegiatan-placeholder/oskm-organizer.png'
              }
            />
          </Link>
          <ProfileKegiatanComp anggota={participant ?? []} session={session} />
        </div>
      </div>
    </div>
  );
};

export default ProfileKegiatan;
