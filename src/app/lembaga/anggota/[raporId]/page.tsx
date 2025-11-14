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
      'profil_lembaga' in profilData
        ? profilData.profil_lembaga.map((lembaga) => ({
            name: lembaga.name,
            description: lembaga.description,
          }))
        : [];

    const mappingData =
      'profil_lembaga' in profilData
        ? profilData.profil_lembaga.flatMap((lembaga) =>
            lembaga.profil_km_id.map((kmId) => ({
              profilKMDescription: profilKMMap.get(kmId) ?? 'Unknown',
              profilKegiatanName: lembaga.name,
              profilKegiatanDescription: lembaga.description,
            })),
          )
        : [];

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
