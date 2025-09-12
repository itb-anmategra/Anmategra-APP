import { SearchBar } from '~/app/_components/placeholder/search-bar';
import { RaporBreadcrumb } from '~/app/_components/rapor/rapor-breadcrumb';
import RaporTable from '~/app/_components/rapor/rapor-table';

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

export default function RaporPage() {
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
        profil={profilHeaders}
        selectOptions={selectOptions}
      />
    </main>
  );
}
