import KegiatanCard from "../../_components/beranda/kegiatanCard";
import ProfilMahasiswa from "../../_components/beranda/profilMahasiswa";

export default function TestPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between gap-20 p-24">
      <KegiatanCard />
      <ProfilMahasiswa />
    </main>
  );
}
