// Library Import
import React from 'react'
// Server Auth
import { getServerAuthSession } from "~/server/auth";
// Components Import
import AnggotaComp from "~/app/lembaga/anggota-kegiatan/_components/anggotaComp";
// Api Import
import { api } from "~/trpc/server";

const DaftarPanitiaKegiatanPage = async (
    {
        params
    }: {
        params: Promise<{ kegiatanId: string }>
    }
) => {
  const session = await getServerAuthSession();
  const query = (await params).kegiatanId
  const anggota_data = await api.event.getAllAnggota({event_id: query});
  const addAnggotaProps = await api.users.tambahAnggotaLembagaData({lembagaId: session?.user.id ?? ""});
  
  return (
      <main>
          <AnggotaComp session={session} data={anggota_data ?? []} dataAddAnggota={addAnggotaProps}/>
      </main>
  );
}

export default DaftarPanitiaKegiatanPage