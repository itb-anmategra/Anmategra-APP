import React from 'react';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';

import ProfilTable from '../../_components/table/event-profil-table';

const ProfilLembaga = async () => {
  try {
    const session = await getServerAuthSession();
    const lembaga_id = session?.user?.lembagaId ?? '';

    if (!lembaga_id) {
      return (
        <div className="flex flex-col gap-y-6 pt-16 px-9 md:px-11">
          <div className="gap-y-2">
            <h1 className="text-neutral-1000 text-[32px] font-semibold">
              Profil Lembaga
            </h1>
            <p>BreadCrumbs</p>
          </div>
          <div className="text-center py-8">
            <p className="text-neutral-500">Session tidak ditemukan</p>
          </div>
        </div>
      );
    }

    const [profilKMData, profilLembagaData] = await Promise.all([
      api.profil.getAllProfilKM(),
      api.profil.getAllProfilLembaga({ lembaga_id }),
    ]);

    const profilKMMap = new Map(
      profilKMData.profil_km.map((km) => [km.id, km.description]),
    );

    const profilLembagaList =
      'profil_lembaga' in profilLembagaData
        ? profilLembagaData.profil_lembaga.map((lembaga) => ({
            name: lembaga.name,
            description: lembaga.description,
          }))
        : [];

    const mappingData =
      'profil_lembaga' in profilLembagaData
        ? profilLembagaData.profil_lembaga.flatMap((lembaga) =>
            lembaga.profil_km_id.map((kmId) => ({
              profilKMDescription: profilKMMap.get(kmId) ?? 'Unknown',
              profilKegiatanName: lembaga.name,
              profilKegiatanDescription: lembaga.description,
            })),
          )
        : [];

    return (
      <div className="flex flex-col gap-y-6 pt-16 px-9 md:px-11">
        <div className="gap-y-2">
          <h1 className="text-neutral-1000 text-[32px] font-semibold">
            Profil Lembaga
          </h1>
          <p>BreadCrumbs</p>
        </div>

        <div className="flex flex-col gap-y-4">
          <h2 className="text-neutral-700 text-[20px] font-normal">
            Profil Lembaga
          </h2>
          <ProfilTable
            profilData={profilLembagaList}
            showMapping={false}
            isLembaga={true}
          />
        </div>

        <div className="flex flex-col gap-y-4">
          <h2 className="text-neutral-700 text-[20px] font-normal">
            Detail Pemetaan Profil Lembaga
          </h2>
          <ProfilTable
            profilData={mappingData}
            showMapping={true}
            isLembaga={true}
          />
        </div>
      </div>
    );
  } catch {
    return (
      <div className="flex flex-col gap-y-6 pt-16 px-9 md:px-11">
        <div className="gap-y-2">
          <h1 className="text-neutral-1000 text-[32px] font-semibold">
            Profil Lembaga
          </h1>
          <p>BreadCrumbs</p>
        </div>
        <div className="text-center py-8">
          <p className="text-neutral-500">Gagal memuat data profil lembaga</p>
        </div>
      </div>
    );
  }
};

export default ProfilLembaga;
