// Server Auth
// Components Import
import AnggotaContent from '~/app/lembaga/anggota/_components/anggota-content';
import { getServerAuthSession } from '~/server/auth';
// Api Import
import { api } from '~/trpc/server';

export default async function Home() {
  const session = await getServerAuthSession();
  const anggota = await api.lembaga.getAllAnggota({
    lembagaId: session?.user.lembagaId ?? '',
  });
  const addAnggotaProps = await api.users.getTambahAnggotaLembagaOptions({
    lembagaId: session?.user.lembagaId ?? '',
  });
  return (
    <main>
      <AnggotaContent
        session={session}
        data={anggota ?? []}
        dataAddAnggota={addAnggotaProps}
      />
    </main>
  );
}
