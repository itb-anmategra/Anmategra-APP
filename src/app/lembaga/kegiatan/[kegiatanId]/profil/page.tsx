import React from 'react';
import { api } from '~/trpc/server';

import ProfilTable from '../../../../_components/table/event-profil-table';

interface ProfilEventProps {
  params: {
    kegiatanId: string;
  };
}

const ProfilEvent = async ({ params }: ProfilEventProps) => {
  try {
    const [profilKMData, profilKegiatanData] = await Promise.all([
      api.profil.getAllProfilKM(),
      api.profil.getAllProfilKegiatan({ event_id: params.kegiatanId }),
    ]);

    const profilKMMap = new Map(
      profilKMData.profil_km.map((km) => [km.id, km.description]),
    );

    const profilKegiatanList =
      'profil_kegiatan' in profilKegiatanData
        ? profilKegiatanData.profil_kegiatan.map((kegiatan) => ({
            name: kegiatan.name,
            description: kegiatan.description,
          }))
        : [];

    const mappingData =
      'profil_kegiatan' in profilKegiatanData
        ? profilKegiatanData.profil_kegiatan.flatMap((kegiatan) =>
            kegiatan.profil_km_id.map((kmId) => ({
              profilKMDescription: profilKMMap.get(kmId) ?? 'Unknown',
              profilKegiatanName: kegiatan.name,
              profilKegiatanDescription: kegiatan.description,
            })),
          )
        : [];

    return (
      <div className="flex flex-col gap-y-6 pt-16 px-9 md:px-11">
        <div className="gap-y-2">
          <h1 className="text-neutral-1000 text-[32px] font-semibold">
            Profil Kegiatan
          </h1>
          <p>BreadCrumbs</p>
        </div>

        <div className="flex flex-col gap-y-4">
          <h2 className="text-neutral-700 text-[20px] font-normal">
            Profil Kegiatan
          </h2>
          <ProfilTable profilData={profilKegiatanList} showMapping={false} />
        </div>

        <div className="flex flex-col gap-y-4">
          <h2 className="text-neutral-700 text-[20px] font-normal">
            Detail Pemetaan Profil Kegiatan
          </h2>
          <ProfilTable profilData={mappingData} showMapping={true} />
        </div>
      </div>
    );
  } catch {
    return (
      <div className="flex flex-col gap-y-6 pt-16 px-9 md:px-11">
        <div className="gap-y-2">
          <h1 className="text-neutral-1000 text-[32px] font-semibold">
            Profil Kegiatan
          </h1>
          <p>BreadCrumbs</p>
        </div>
        <div className="text-center py-8">
          <p className="text-neutral-500">Gagal memuat data profil kegiatan</p>
        </div>
      </div>
    );
  }
};

export default ProfilEvent;
