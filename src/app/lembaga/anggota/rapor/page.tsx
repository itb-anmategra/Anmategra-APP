import { SearchBar } from '~/app/_components/placeholder/search-bar';
import { RaporBreadcrumb } from '~/app/_components/rapor/rapor-breadcrumb';
import RaporTable from '~/app/_components/rapor/rapor-table';
import { getAllAnggota } from '~/server/api/routers/event/getByID';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';

const anggotaList = [
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
  {
    nama: 'Naila secira budiana',
    nim: '12324567',
    profil: ['100', '100', '100', '100'],
  },
];

const profilHeaders = [
  { label: 'Profil 1', deskripsi: '', pemetaan: '' },
  { label: 'Profil 2', deskripsi: '', pemetaan: '' },
  { label: 'Profil 3', deskripsi: '', pemetaan: '' },
  { label: 'Profil 4', deskripsi: '', pemetaan: '' },
];

const selectOptions = [
  {
    value: 'profil-1-dan-profil-2',
    label:
      'Memiliki kemampuan berpikir tingkat tinggi dan mampu mengimplementasikannya dalam kehidupan sehari-hari',
  },
  {
    value: 'profil-3',
    label: 'Memiliki kemampuan sebagai pembelajar seumur hidup',
  },
  {
    value: 'profil-4',
    label:
      'Memiliki kemampuan untuk berkolaborasi secara efektif dalam lingkungan masyarakat akademik maupun masyarakat umum',
  },
  {
    value: 'profil-5',
    label:
      'Memiliki kesadaran akan tanggung jawab sosial serta mampu menerapkan pendekatan multidisiplin dan interdisiplin dalam memecahkan berbagai masalah terkait keprofesian dan masyarakat yang luas',
  },
];

export default async function RaporPage() {
  const session = await getServerAuthSession();
  const anggota = await api.lembaga.getAllAnggota({
    lembagaId: session?.user.lembagaId ?? '',
  });

  const profilResult = await api.profil.getAllProfilLembaga({
    lembaga_id: session?.user.lembagaId ?? '',
  });
  const profilLembaga =
    'profil_lembaga' in profilResult ? profilResult.profil_lembaga : [];
  return (
    <main className="flex flex-col p-8 min-h-screen">
      <h1 className="text-[32px] font-semibold mb-2">Wisnight</h1>
      <RaporBreadcrumb
        items={[
          { label: 'Anggota', href: '/lembaga/anggota/rapor' },
          { label: 'Rapor', href: '/lembaga/anggota/rapor' },
        ]}
      />
      <div className="mb-4" />
      <SearchBar placeholder="Cari nama anggota" />
      <div className="mb-6" />
      <RaporTable
        data={anggotaList}
        profil={profilLembaga}
        selectOptions={selectOptions}
        lembagaId={session?.user.lembagaId ?? ''}
      />
    </main>
  );
}
