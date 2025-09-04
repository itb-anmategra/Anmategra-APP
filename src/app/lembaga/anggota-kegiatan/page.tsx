// Server Auth
import { getServerAuthSession } from "~/server/auth";
// Components Import
import AnggotaContent from "~/app/lembaga/anggota-kegiatan/_components/anggota-content";
// Api Import
import { api } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();
  const anggota = await api.lembaga.getAllAnggota({lembagaId: session?.user.id ?? ""});
  const addAnggotaProps = await api.users.tambahAnggotaLembagaData({lembagaId: session?.user.id ?? ""});
  return (
      <main>
          <AnggotaContent session={session} data={anggota ?? []} dataAddAnggota={addAnggotaProps}/>
      </main>
  );
}
