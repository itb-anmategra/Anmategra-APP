import React from 'react';
import { api } from '~/trpc/server';

import ProfilTable from '../../_components/table/event-profil-table';

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

    const transformedData = profilKMData.profil_km
      .map((kmProfil) => {
        const matchingEventProfils =
          'profil_kegiatan' in profilKegiatanData
            ? profilKegiatanData.profil_kegiatan.filter((eventProfil) =>
                eventProfil.profil_km_id.includes(kmProfil.id),
              )
            : [];

        return {
          kmProfil: kmProfil.description,
          eventProfil: matchingEventProfils.map((eventProfil) => ({
            profilId: Number(eventProfil.id),
            profilDescription: eventProfil.description,
          })),
          hasMatches: matchingEventProfils.length > 0,
        };
      })
      .filter((item) => item.hasMatches)
      .map(({ kmProfil, eventProfil }) => ({ kmProfil, eventProfil }));
    return (
      <div className="flex flex-col gap-y-6 pt-16 px-9 md:px-11">
        <div className="gap-y-2">
          <h1 className="text-neutral-1000 text-[32px] font-semibold">
            Event Profil
          </h1>
          <p>BreadCrumbs</p>
        </div>
        <ProfilTable profilData={transformedData} />
      </div>
    );
  } catch (error) {
    return (
      <div className="flex flex-col gap-y-6 pt-16 px-9 md:px-11">
        <div className="gap-y-2">
          <h1 className="text-neutral-1000 text-[32px] font-semibold">
            Event Profil
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
