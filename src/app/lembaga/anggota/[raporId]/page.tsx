import { type z } from 'zod';
import PemetaanProfilSection from '~/app/_components/rapor/individu/pemetaan-profil-section';
import ProfilDeskripsiSection from '~/app/_components/rapor/individu/profil-deskripsi-section';
import RaporIndividuHeader from '~/app/_components/rapor/individu/rapor-individu-header';
import { RaporBreadcrumb } from '~/app/_components/rapor/rapor-breadcrumb';
import { type ProfilGroup } from '~/app/lembaga/kegiatan/[kegiatanId]/profil/constant';
import { type GetAllProfilOutputSchema } from '~/server/api/types/profil.type';
import { type GetNilaiLembagaIndividuOutputSchema } from '~/server/api/types/rapor.type';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';

type NilaiLembagaOutput = z.infer<typeof GetNilaiLembagaIndividuOutputSchema>;
type ProfilLembagaOutput = z.infer<typeof GetAllProfilOutputSchema>;

export type HeaderDataLembagaProps = {
  dataNilaiProfil: NilaiLembagaOutput | null;
  kegiatanId?: string;
};

export type ProfilLembagaSectionProps = ProfilLembagaOutput;

export type PemetaanProfilSectionProps = {
  pemetaanProfilData?: ProfilGroup[];
};

interface RaporIndividuLembagaPageProps {
  params: {
    raporId: string;
  };
  pemetaanProfilData?: PemetaanProfilSectionProps;
}

export default async function RaporIndividuLembagaPage({
  params,
  pemetaanProfilData,
}: RaporIndividuLembagaPageProps) {
  const { raporId } = params;

  const session = await getServerAuthSession();

  const raporData = await api.rapor.getNilaiLembagaIndividu({
    lembaga_id: session?.user.lembagaId ?? '',
    mahasiswa_id: raporId,
  });

  const profilData = await api.profil.getAllProfilLembaga({
    lembaga_id: session?.user.lembagaId ?? '',
  });

  return (
    <main className="flex flex-col p-8 min-h-screen">
      <div className="flex flex-col pb-7 border-b border-neutral-400 mb-8">
        <h1 className="text-[32px] font-semibold mb-2 text-neutral-1000">
          Rapor Individu
        </h1>
        <RaporBreadcrumb
          items={[
            { label: 'Anggota', href: '/lembaga/anggota' },
            { label: 'Rapor Individu', href: '/lembaga/anggota' },
          ]}
        />
      </div>

      <div className="flex flex-col gap-16">
        <RaporIndividuHeader
          dataNilaiProfil={raporData}
          id={session?.user.lembagaId ?? ''}
          isLembaga={true}
        />

        <ProfilDeskripsiSection profilData={profilData} isLembaga={true} />

        <PemetaanProfilSection {...pemetaanProfilData} />
      </div>
    </main>
  );
}
