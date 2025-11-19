import React from 'react';
import { type z } from 'zod';
import RaporIndividuHeader from '~/app/_components/rapor/individu/rapor-individu-header';
import { RaporBreadcrumb } from '~/app/_components/rapor/rapor-breadcrumb';
import { type GetAllProfilOutputSchema } from '~/server/api/types/profil.type';
import { type GetNilaiLembagaIndividuOutputSchema } from '~/server/api/types/rapor.type';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';

import ProfilTable from '../../../_components/table/event-profil-table';

type NilaiLembagaOutput = z.infer<typeof GetNilaiLembagaIndividuOutputSchema>;
type ProfilLembagaOutput = z.infer<typeof GetAllProfilOutputSchema>;

export type HeaderDataLembagaProps = {
  dataNilaiProfil: NilaiLembagaOutput | null;
  kegiatanId?: string;
};

export type ProfilLembagaSectionProps = ProfilLembagaOutput;

interface RaporIndividuLembagaPageProps {
  params: {
    raporId: string;
  };
}

export default async function RaporIndividuLembagaPage({
  params,
}: RaporIndividuLembagaPageProps) {
  const { raporId } = params;

  const session = await getServerAuthSession();

  try {
    const [raporData, profilData, profilKMData] = await Promise.all([
      api.rapor.getNilaiLembagaIndividu({
        lembaga_id: session?.user.lembagaId ?? '',
        mahasiswa_id: raporId,
      }),
      api.profil.getAllProfilLembaga({
        lembaga_id: session?.user.lembagaId ?? '',
      }),
      api.profil.getAllProfilKM(),
    ]);

    const profilKMMap = new Map(
      profilKMData.profil_km.map((km) => [km.id, km.description]),
    );

    const profilLembagaList =
      'profil_lembaga' in profilData && profilData.profil_lembaga.length > 0
        ? profilData.profil_lembaga.map((lembaga) => ({
            name: lembaga.name,
            description: lembaga.description,
          }))
        : [
            {
              name: 'Kepemimpinan',
              description:
                'Kemampuan untuk memimpin tim, mengambil keputusan strategis, dan menginspirasi anggota lainnya dalam mencapai tujuan bersama.',
            },
            {
              name: 'Kerja Sama Tim',
              description:
                'Kemampuan untuk bekerja secara efektif dengan anggota tim lain, berbagi tanggung jawab, dan berkontribusi dalam mencapai tujuan kolektif.',
            },
            {
              name: 'Komunikasi',
              description:
                'Kemampuan menyampaikan informasi dengan jelas dan efektif, baik secara lisan maupun tulisan, serta mendengarkan dengan baik.',
            },
            {
              name: 'Manajemen Waktu',
              description:
                'Kemampuan untuk mengatur dan memprioritaskan tugas dengan efisien, memenuhi deadline, dan mengoptimalkan produktivitas.',
            },
            {
              name: 'Kreativitas dan Inovasi',
              description:
                'Kemampuan untuk berpikir kreatif, menghasilkan ide-ide baru, dan menemukan solusi inovatif terhadap tantangan yang dihadapi.',
            },
          ];

    const mappingData =
      'profil_lembaga' in profilData && profilData.profil_lembaga.length > 0
        ? profilData.profil_lembaga.flatMap((lembaga) =>
            lembaga.profil_km_id.map((kmId) => ({
              profilKMDescription: profilKMMap.get(kmId) ?? 'Unknown',
              profilKegiatanName: lembaga.name,
              profilKegiatanDescription: lembaga.description,
            })),
          )
        : [
            {
              profilKMDescription: 'Integritas dan Etika',
              profilKegiatanName: 'Kepemimpinan',
              profilKegiatanDescription:
                'Kemampuan untuk memimpin tim, mengambil keputusan strategis, dan menginspirasi anggota lainnya dalam mencapai tujuan bersama.',
            },
            {
              profilKMDescription: 'Berfikir Kritis dan Pemecahan Masalah',
              profilKegiatanName: 'Kepemimpinan',
              profilKegiatanDescription:
                'Kemampuan untuk memimpin tim, mengambil keputusan strategis, dan menginspirasi anggota lainnya dalam mencapai tujuan bersama.',
            },
            {
              profilKMDescription: 'Kolaborasi dan Komunikasi',
              profilKegiatanName: 'Kerja Sama Tim',
              profilKegiatanDescription:
                'Kemampuan untuk bekerja secara efektif dengan anggota tim lain, berbagi tanggung jawab, dan berkontribusi dalam mencapai tujuan kolektif.',
            },
            {
              profilKMDescription: 'Kreativitas dan Inovasi',
              profilKegiatanName: 'Kreativitas dan Inovasi',
              profilKegiatanDescription:
                'Kemampuan untuk berpikir kreatif, menghasilkan ide-ide baru, dan menemukan solusi inovatif terhadap tantangan yang dihadapi.',
            },
            {
              profilKMDescription: 'Kepemimpinan dan Tanggung Jawab Sosial',
              profilKegiatanName: 'Kepemimpinan',
              profilKegiatanDescription:
                'Kemampuan untuk memimpin tim, mengambil keputusan strategis, dan menginspirasi anggota lainnya dalam mencapai tujuan bersama.',
            },
            {
              profilKMDescription: 'Kolaborasi dan Komunikasi',
              profilKegiatanName: 'Komunikasi',
              profilKegiatanDescription:
                'Kemampuan menyampaikan informasi dengan jelas dan efektif, baik secara lisan maupun tulisan, serta mendengarkan dengan baik.',
            },
            {
              profilKMDescription: 'Manajemen Diri dan Pengembangan Pribadi',
              profilKegiatanName: 'Manajemen Waktu',
              profilKegiatanDescription:
                'Kemampuan untuk mengatur dan memprioritaskan tugas dengan efisien, memenuhi deadline, dan mengoptimalkan produktivitas.',
            },
          ];

    return (
      <main className="flex flex-col p-4 sm:p-6 md:p-8 min-h-screen">
        <div className="flex flex-col pb-4 sm:pb-6 md:pb-7 border-b border-neutral-400 mb-6 sm:mb-7 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-[32px] font-semibold mb-2 text-neutral-1000">
            Rapor Individu
          </h1>
          <RaporBreadcrumb
            items={[
              { label: 'Anggota', href: '/lembaga/anggota' },
              { label: 'Rapor Individu', href: '/lembaga/anggota' },
            ]}
          />
        </div>

        <div className="flex flex-col gap-8 sm:gap-12 md:gap-16">
          <RaporIndividuHeader
            dataNilaiProfil={raporData}
            id={session?.user.lembagaId ?? ''}
            isLembaga={true}
          />
          <div className="flex flex-col gap-y-3 sm:gap-y-4">
            <h2 className="text-neutral-700 text-lg sm:text-xl md:text-[20px] font-normal">
              Profil Lembaga
            </h2>
            <ProfilTable
              profilData={profilLembagaList}
              showMapping={false}
              isLembaga={true}
            />
          </div>

          <div className="flex flex-col gap-y-3 sm:gap-y-4">
            <h2 className="text-neutral-700 text-lg sm:text-xl md:text-[20px] font-normal">
              Detail Pemetaan Profil Lembaga
            </h2>
            <ProfilTable
              profilData={mappingData}
              showMapping={true}
              isLembaga={true}
            />
          </div>
        </div>
      </main>
    );
  } catch {
    return (
      <main className="flex flex-col p-4 sm:p-6 md:p-8 min-h-screen">
        <div className="flex flex-col pb-4 sm:pb-6 md:pb-7 border-b border-neutral-400 mb-6 sm:mb-7 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-[32px] font-semibold mb-2 text-neutral-1000">
            Rapor Individu
          </h1>
          <RaporBreadcrumb
            items={[
              { label: 'Anggota', href: '/lembaga/anggota' },
              { label: 'Rapor Individu', href: '/lembaga/anggota' },
            ]}
          />
        </div>
        <div className="text-center py-6 sm:py-8">
          <p className="text-sm sm:text-base text-neutral-500">Gagal memuat data rapor individu</p>
        </div>
      </main>
    );
  }
}
