import RaporIndividuHeader from "~/app/_components/rapor/individu/rapor-individu-header";
import { RaporBreadcrumb } from "~/app/_components/rapor/rapor-breadcrumb";
import { type NilaiProfilCardType } from "~/app/_components/card/nilai-profil-card";
import NilaiProfilComp from "~/app/_components/rapor/individu/nilai-profil-comp";
import ProfilKegiatanSection from "~/app/_components/rapor/individu/profil-kegiatan-section";
import PemetaanProfilSection from "~/app/_components/rapor/individu/pemetaan-profil-section";

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
}

export type NilaiProfilCompProps = {
  nilaiProfils?: NilaiProfilCardType[];
}

export type NilaiProfilType = {
  namaProfil: string;
  deskripsiProfil: string;
}

export type ProfilKegiatanSectionProps = {
  nilaiProfilData?: NilaiProfilType[];
}

const dummyHeaderData: HeaderDataProps = {
  profilePictureLembaga: "/images/logo/hmif-logo.png",
  lembagaName: "HMIF ITB",
  kegiatanName: "WISUDA OKTOBER 2024",
  profilePictureIndividu: "/images/placeholder/profile-pic.png",
  individuName: "John Doe",
  individuNIM: "12345678",
  individuJurusan: "Sastra Mesin",
  individuDivisi: "UI/UX",
  individuPosisi: "Staff",
  individuLine: "john_doe",
  individuWA: "081234567890",
}

interface RaporIndividuPanitiaPageProps {
  headerData?: HeaderDataProps;
  nilaiProfils?: NilaiProfilCompProps;
  profilKegiatanData?: ProfilKegiatanSectionProps;
}

export default function RaporIndividuPanitiaPage({
  headerData = dummyHeaderData,
  nilaiProfils,
  profilKegiatanData,
} : RaporIndividuPanitiaPageProps) {
  return (
    <main className="flex flex-col p-8 min-h-screen">
      <div className="flex flex-col pb-7 border-b border-neutral-400 mb-8">
        <h1 className="text-[32px] font-semibold mb-2 text-neutral-1000">Rapor Individu</h1>
        <RaporBreadcrumb 
          items = {[
            { label: 'Kegiatan', href: '/lembaga/kegiatan' },
            { label: 'Panitia', href: '/lembaga/kegiatan' },
            { label: "Rapor Individu", href: '/lembaga/kegiatan' }
          ]}
        />
      </div>

      <div className="flex flex-col gap-16">
        <RaporIndividuHeader
          {...headerData}
        />

        <NilaiProfilComp
          {...nilaiProfils}
        />

        <ProfilKegiatanSection
          {...profilKegiatanData}
        />

        <PemetaanProfilSection />
      </div>
    </main>
  )
}