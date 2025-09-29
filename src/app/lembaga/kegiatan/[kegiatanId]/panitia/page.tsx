// Library Import
import React from 'react';
// Components Import
import AnggotaContent from '~/app/lembaga/anggota/_components/anggota-content';
// Server Auth
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

const mockPanitiaData = [
  {
    id: '1',
    nama: 'Ahmad Rizki',
    nim: '13520001',
    jurusan: 'Teknik Informatika',
    posisi: 'Ketua Panitia',
    divisi: 'Inti',
    posisiColor: 'blue',
  },
  {
    id: '2',
    nama: 'Sari Dewi',
    nim: '13520002',
    jurusan: 'Sistem Informasi',
    posisi: 'Wakil Ketua',
    divisi: 'Inti',
    posisiColor: 'green',
  },
  {
    id: '3',
    nama: 'Budi Santoso',
    nim: '13520003',
    jurusan: 'Teknik Informatika',
    posisi: 'Sekretaris',
    divisi: 'Administrasi',
    posisiColor: 'yellow',
  },
  {
    id: '4',
    nama: 'Maya Putri',
    nim: '13520004',
    jurusan: 'Sistem Informasi',
    posisi: 'Bendahara',
    divisi: 'Keuangan',
    posisiColor: 'red',
  },
  {
    id: '5',
    nama: 'Andi Pratama',
    nim: '13520005',
    jurusan: 'Teknik Informatika',
    posisi: 'Koordinator',
    divisi: 'Acara',
    posisiColor: 'navy',
  },
  {
    id: '6',
    nama: 'Rina Sari',
    nim: '13520006',
    jurusan: 'Sistem Informasi',
    posisi: 'Koordinator',
    divisi: 'Konsumsi',
    posisiColor: 'green',
  },
  {
    id: '7',
    nama: 'Dedi Kurniawan',
    nim: '13520007',
    jurusan: 'Teknik Informatika',
    posisi: 'Koordinator',
    divisi: 'Dekorasi',
    posisiColor: 'blue',
  },
  {
    id: '8',
    nama: 'Lina Maharani',
    nim: '13520008',
    jurusan: 'Sistem Informasi',
    posisi: 'Koordinator',
    divisi: 'Publikasi',
    posisiColor: 'yellow',
  },
  {
    id: '9',
    nama: 'Rendi Saputra',
    nim: '13520009',
    jurusan: 'Teknik Informatika',
    posisi: 'Anggota',
    divisi: 'Acara',
    posisiColor: 'green',
  },
  {
    id: '10',
    nama: 'Indah Permata',
    nim: '13520010',
    jurusan: 'Sistem Informasi',
    posisi: 'Anggota',
    divisi: 'Konsumsi',
    posisiColor: 'blue',
  },
  {
    id: '11',
    nama: 'Fajar Hidayat',
    nim: '13520011',
    jurusan: 'Teknik Informatika',
    posisi: 'Anggota',
    divisi: 'Dekorasi',
    posisiColor: 'navy',
  },
  {
    id: '12',
    nama: 'Novi Rahayu',
    nim: '13520012',
    jurusan: 'Sistem Informasi',
    posisi: 'Anggota',
    divisi: 'Publikasi',
    posisiColor: 'red',
  },
  {
    id: '13',
    nama: 'Rizky Fauzi',
    nim: '13520013',
    jurusan: 'Teknik Informatika',
    posisi: 'Anggota',
    divisi: 'Acara',
    posisiColor: 'yellow',
  },
  {
    id: '14',
    nama: 'Dewi Sartika',
    nim: '13520014',
    jurusan: 'Sistem Informasi',
    posisi: 'Anggota',
    divisi: 'Administrasi',
    posisiColor: 'green',
  },
  {
    id: '15',
    nama: 'Arif Rahman',
    nim: '13520015',
    jurusan: 'Teknik Informatika',
    posisi: 'Anggota',
    divisi: 'Keuangan',
    posisiColor: 'blue',
  },
];

const mockAddPanitiaProps = {
  mahasiswa: [
    { value: '1', label: 'Ahmad Rizki' },
    { value: '2', label: 'Sari Dewi' },
    { value: '3', label: 'Budi Santoso' },
    { value: '4', label: 'Maya Putri' },
    { value: '5', label: 'Andi Pratama' },
    { value: '16', label: 'Available Student 1' },
    { value: '17', label: 'Available Student 2' },
    { value: '18', label: 'Available Student 3' },
  ],
  nim: [
    { value: '13520001', label: '13520001' },
    { value: '13520002', label: '13520002' },
    { value: '13520003', label: '13520003' },
    { value: '13520004', label: '13520004' },
    { value: '13520005', label: '13520005' },
    { value: '13520016', label: '13520016' },
    { value: '13520017', label: '13520017' },
    { value: '13520018', label: '13520018' },
  ],
  posisi: [
    { value: 'ketua-panitia', label: 'Ketua Panitia' },
    { value: 'wakil-ketua', label: 'Wakil Ketua' },
    { value: 'sekretaris', label: 'Sekretaris' },
    { value: 'bendahara', label: 'Bendahara' },
    { value: 'koordinator', label: 'Koordinator' },
    { value: 'anggota', label: 'Anggota' },
  ],
  bidang: [
    { value: 'inti', label: 'Inti' },
    { value: 'acara', label: 'Acara' },
    { value: 'konsumsi', label: 'Konsumsi' },
    { value: 'dekorasi', label: 'Dekorasi' },
    { value: 'publikasi', label: 'Publikasi' },
    { value: 'administrasi', label: 'Administrasi' },
    { value: 'keuangan', label: 'Keuangan' },
  ],
};

const DaftarPanitiaKegiatanPage = async ({
  params,
}: {
  params: Promise<{ kegiatanId: string }>;
}) => {
  const session = await getServerAuthSession();
  const query = (await params).kegiatanId;
  const formatted_anggota = await api.event.getAllAnggota({ event_id: query });
  const addAnggotaProps = await api.users.getTambahAnggotaKegiatanOptions({
    kegiatanId: query,
  });

  // Mock query parameter for local development
  // const mockQuery = 'mock-kegiatan-id';

  return (
    <main>
      {/* <AnggotaContent
        session={mockSession}
        data={mockPanitiaData}
        dataAddAnggota={mockAddPanitiaProps}
      /> */}
      <AnggotaContent
        session={session}
        data={formatted_anggota ?? []}
        dataAddAnggota={addAnggotaProps}
      />
    </main>
  );
};

export default DaftarPanitiaKegiatanPage;
