import {getServerAuthSession} from "~/server/auth";
import AnggotaComp from "~/app/lembaga/anggota-kegiatan/_components/anggotaComp";
import {api} from "~/trpc/server";
import {redirect} from "next/navigation";

export default async function Home() {
  const session = await getServerAuthSession();
    const {anggota, error} = await api.lembaga.getAllAnggota({lembagaId: session?.user.id ?? ""});
  return (
      <main>
          <AnggotaComp session={session} data={anggota ?? []}/>
      </main>
  );
}
