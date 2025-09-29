// Server Auth
// Components Import
import AnggotaContent from '~/app/lembaga/anggota/_components/anggota-content';
import { getServerAuthSession } from '~/server/auth';
// Api Import
import { api } from '~/trpc/server';

const mockSession = {
  user: {
    id: 'mock-user-id',
    lembagaId: 'mock-lembaga-id',
    name: 'Mock User',
    email: 'mock@example.com',
    image: 'mock-image-url',
    role: 'lembaga' as const,
  },
  expires: '2025-12-31',
};

const mockAnggotaData = [
  {
    id: '1',
    nama: 'John Doe',
    nim: '13518001',
    jurusan: 'Teknik Informatika',
    posisi: 'Ketua',
    divisi: 'Teknologi',
    posisiColor: 'blue',
  },
  {
    id: '2',
    nama: 'Jane Smith',
    nim: '13518002',
    jurusan: 'Sistem Informasi',
    posisi: 'Wakil Ketua',
    divisi: 'Operasional',
    posisiColor: 'green',
  },
];

const mockAddAnggotaProps = {
  mahasiswa: [
    { value: '1', label: 'John Doe' },
    { value: '2', label: 'Jane Smith' },
  ],
  nim: [
    { value: '13518001', label: '13518001' },
    { value: '13518002', label: '13518002' },
  ],
  posisi: [
    { value: 'ketua', label: 'Ketua' },
    { value: 'wakil', label: 'Wakil Ketua' },
    { value: 'anggota', label: 'Anggota' },
  ],
  bidang: [
    { value: 'teknologi', label: 'Teknologi' },
    { value: 'operasional', label: 'Operasional' },
    { value: 'keuangan', label: 'Keuangan' },
  ],
};

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
      {/* <AnggotaContent
        session={mockSession}
        data={mockAnggotaData}
        dataAddAnggota={mockAddAnggotaProps}
      /> */}
      <AnggotaContent
        session={session}
        data={anggota}
        dataAddAnggota={addAnggotaProps}
      />
    </main>
  );
}
