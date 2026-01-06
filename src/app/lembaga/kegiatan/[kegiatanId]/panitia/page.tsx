// Library Import
import React from 'react';
// Components Import
import AnggotaContent from '~/app/lembaga/anggota/_components/anggota-content';
// Server Auth
import { getServerAuthSession } from '~/server/auth';
// Api Import
import { api } from '~/trpc/server';

const DaftarPanitiaKegiatanPage = async ({
  params,
}: {
  params: Promise<{ kegiatanId: string }>;
}) => {
  const session = await getServerAuthSession();
  const query = (await params).kegiatanId;
  const formatted_anggota = await api.event.getAllAnggota({ event_id: query });
  const getPosisiBidang = await api.kegiatan.getPosisiBidangOptions({
    event_id: query,
  });

  return (
    <main>
      <AnggotaContent
        session={session}
        data={formatted_anggota ?? []}
        dataPosisiBidang={getPosisiBidang}
        pageAnggota={false}
      />
    </main>
  );
};

export default DaftarPanitiaKegiatanPage;
