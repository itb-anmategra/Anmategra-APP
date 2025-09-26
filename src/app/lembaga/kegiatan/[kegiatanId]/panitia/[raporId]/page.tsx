import { type z } from 'zod';
import { type NilaiProfilCardType } from '~/app/_components/card/nilai-profil-card';
import PemetaanProfilSection from '~/app/_components/rapor/individu/pemetaan-profil-section';
import ProfilKegiatanSection from '~/app/_components/rapor/individu/profil-kegiatan-section';
import RaporIndividuHeader from '~/app/_components/rapor/individu/rapor-individu-header';
import { RaporBreadcrumb } from '~/app/_components/rapor/rapor-breadcrumb';
import { type ProfilGroup } from '~/app/lembaga/kegiatan/[kegiatanId]/profil/constant';
import { type GetAllProfilOutputSchema } from '~/server/api/types/profil.type';
import { type GetNilaiKegiatanIndividuOutputSchema } from '~/server/api/types/rapor.type';
import { api } from '~/trpc/server';

type NilaiKegiatanOutput = z.infer<typeof GetNilaiKegiatanIndividuOutputSchema>;
type ProfilOutput = z.infer<typeof GetAllProfilOutputSchema>;

export type HeaderDataProps = {
  dataNilaiProfil: NilaiKegiatanOutput | null;
  kegiatanId?: string;
};

export type HeaderDataProp = {
  profilePictureLembaga?: string | null;
  lembagaName: string;
  kegiatanName?: string;
  profilePictureIndividu?: string | null;
  individuName: string;
  individuNIM: string;
  individuJurusan: string;
  individuDivisi: string;
  individuPosisi: string | null;
  individuLine?: string | null;
  individuWA?: string | null;
  nilaiProfils?: NilaiProfilCardType[];
};

export type ProfilDeskripsiType = {
  idProfil: string;
  namaProfil: string;
  deskripsiProfil: string;
};

export type ProfilKegiatanSectionProps = ProfilOutput;

export type PemetaanProfilSectionProps = {
  pemetaanProfilData?: ProfilGroup[];
};

interface RaporIndividuPanitiaPageProps {
  params: {
    kegiatanId: string;
    raporId: string;
  };
  pemetaanProfilData?: PemetaanProfilSectionProps;
}

export default async function RaporIndividuPanitiaPage({
  params,
  pemetaanProfilData,
}: RaporIndividuPanitiaPageProps) {
  const { kegiatanId, raporId } = params;

  const raporData = await api.rapor.getNilaiKegiatanIndividu({
    event_id: kegiatanId,
    mahasiswa_id: raporId,
  });

  const profilData = await api.profil.getAllProfilKegiatan({
    event_id: kegiatanId,
  });

  return (
    <main className="flex flex-col p-8 min-h-screen">
      <div className="flex flex-col pb-7 border-b border-neutral-400 mb-8">
        <h1 className="text-[32px] font-semibold mb-2 text-neutral-1000">
          Rapor Individu
        </h1>
        <RaporBreadcrumb
          items={[
            { label: 'Kegiatan', href: '/lembaga/kegiatan' },
            { label: 'Panitia', href: '/lembaga/kegiatan' },
            { label: 'Rapor Individu', href: '/lembaga/kegiatan' },
          ]}
        />
      </div>

      <div className="flex flex-col gap-16">
        <RaporIndividuHeader
          dataNilaiProfil={raporData}
          kegiatanId={kegiatanId}
        />

        <ProfilKegiatanSection {...profilData} />

        <PemetaanProfilSection {...pemetaanProfilData} />
      </div>
    </main>
  );
}
