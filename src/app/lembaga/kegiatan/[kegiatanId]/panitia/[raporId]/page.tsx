import { type NilaiProfilCardType } from '~/app/_components/card/nilai-profil-card';
import PemetaanProfilSection from '~/app/_components/rapor/individu/pemetaan-profil-section';
import ProfilKegiatanSection from '~/app/_components/rapor/individu/profil-kegiatan-section';
import RaporIndividuHeader from '~/app/_components/rapor/individu/rapor-individu-header';
import { RaporBreadcrumb } from '~/app/_components/rapor/rapor-breadcrumb';
import { type ProfilGroup } from '~/app/lembaga/kegiatan/[kegiatanId]/profil/constant';

// dua type di bawah ini sebagai catatan ketika integrasi nanti
// format data dari API untuk display pada bagian tabel profil kegiatan
// dan pemetaan profil kegiatan dengan profil KM ITB
type dataProfil = {
  id: string;
  name: string;
  description: string;
  profil_km_id: string[];
};

// format data dari API untuk display pada header rapor individu, perlu fetch
// foto lembaga dan foto individu dulu untuk melengkapi props
type dataProfilIndividu = {
  user_id: string;
  name: string;
  nim: string;
  jurusan: string;
  lineId: string;
  whatsapp: string;
  division: string;
  position: string;
  nilai: [
    {
      profil_id: string;
      nilai: number;
    },
    {
      profil_id: string;
      nilai: number;
    },
  ];
};

export type HeaderDataProps = {
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

export type ProfilKegiatanSectionProps = {
  nilaiProfilData?: ProfilDeskripsiType[];
};

export type PemetaanProfilSectionProps = {
  pemetaanProfilData?: ProfilGroup[];
};

const dummyNilaiProfils: NilaiProfilCardType[] = [
  { idProfil: 'Profil 1', nilaiProfil: 100 },
  { idProfil: 'Profil 2', nilaiProfil: 89 },
  { idProfil: 'Profil 3', nilaiProfil: 95 },
  { idProfil: 'Profil 4', nilaiProfil: 85 },
  { idProfil: 'Profil 5', nilaiProfil: 80 },
  { idProfil: 'Profil 6', nilaiProfil: 75 },
  { idProfil: 'Profil 7', nilaiProfil: 70 },
  { idProfil: 'Profil 8', nilaiProfil: 65 },
];

const dummyHeaderData: HeaderDataProps = {
  profilePictureLembaga: '/images/logo/hmif-logo.png',
  lembagaName: 'HMIF ITB',
  kegiatanName: 'WISUDA OKTOBER 2024',
  profilePictureIndividu: '/images/placeholder/profile-pic.png',
  individuName: 'John Doe',
  individuNIM: '12345678',
  individuJurusan: 'Sastra Mesin',
  individuDivisi: 'UI/UX',
  individuPosisi: 'Staff',
  individuLine: 'john_doe',
  individuWA: '081234567890',
  nilaiProfils: dummyNilaiProfils,
};

interface RaporIndividuPanitiaPageProps {
  headerData?: HeaderDataProps;
  profilKegiatanData?: ProfilKegiatanSectionProps;
  pemetaanProfilData?: PemetaanProfilSectionProps;
}

export default function RaporIndividuPanitiaPage({
  headerData = dummyHeaderData,
  profilKegiatanData,
  pemetaanProfilData,
}: RaporIndividuPanitiaPageProps) {
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
        <RaporIndividuHeader {...headerData} />

        <ProfilKegiatanSection {...profilKegiatanData} />

        <PemetaanProfilSection {...pemetaanProfilData} />
      </div>
    </main>
  );
}
