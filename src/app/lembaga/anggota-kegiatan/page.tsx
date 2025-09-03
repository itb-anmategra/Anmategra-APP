// Server Auth
import { getServerAuthSession } from "~/server/auth";
// Components Import
import AnggotaComp from "~/app/lembaga/anggota-kegiatan/_components/anggotaComp";
// Api Import
import { api } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();
  const anggota = await api.lembaga.getAllAnggota({lembagaId: session?.user.lembagaId ?? ""});
  const addAnggotaProps = await api.users.getTambahAnggotaLembagaOptions({lembagaId: session?.user.lembagaId ?? ""});
  return (
      <main>
          <AnggotaComp session={session} data={anggota ?? []} dataAddAnggota={addAnggotaProps}/>
      </main>
  );
}
