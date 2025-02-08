// Library Import
import React from 'react'
// Server Auth
import { getServerAuthSession } from "~/server/auth";
// Components Import
import AnggotaComp from "~/app/lembaga/anggota-kegiatan/_components/anggotaComp";
// Api Import
import { api } from "~/trpc/server";

const DaftarPanitiaKegiatanPage = async () => {
  const session = await getServerAuthSession();
  const { anggota, error } = await api.lembaga.getAllAnggota({lembagaId: session?.user.id ?? ""});
  const addAnggotaProps = await api.users.tambahAnggotaLembagaData({lembagaId: session?.user.id ?? ""});
  
  return (
      <main>
          <AnggotaComp session={session} data={anggota ?? []} dataAddAnggota={addAnggotaProps}/>
      </main>
  );
}

export default DaftarPanitiaKegiatanPage