// Library Import
import React from 'react'
// Server Auth
import {getServerAuthSession} from "~/server/auth";
// Components Import
import AnggotaComp from "~/app/lembaga/anggota-kegiatan/_components/anggota-content";
// Api Import
import {api} from "~/trpc/server";

const DaftarPanitiaKegiatanPage = async (
    {
        params
    }: {
        params: Promise<{ kegiatanId: string }>
    }
) => {
    const session = await getServerAuthSession();
    const query = (await params).kegiatanId
    const formatted_anggota = await api.event.getAllAnggota({event_id: query});
    const addAnggotaProps = await api.users.tambahAnggotaKegiatanData({kegiatanId: query});
    return (
        <main>
            <AnggotaComp session={session} data={formatted_anggota ?? []} dataAddAnggota={addAnggotaProps}/>
        </main>
    );
}

export default DaftarPanitiaKegiatanPage