// src/app/lembaga/profile-lembaga/_components/dummy-data.ts

// Tipe opsional biar rapih
export interface Mahasiswa {
  id: string;
  nama: string;
  NIM: string;
  jurusan: string;
  profilePhoto: string;
  divisi: string;
}

export interface Periode {
  startDate: string;
  endDate: string;
}

// Dummy periode
export const dummyDate: Periode[] = [
  { startDate: 'Januari', endDate: 'Februari' },
  { startDate: 'Maret', endDate: 'April' },
  { startDate: 'Mei', endDate: 'Juni' },
  { startDate: 'Juli', endDate: 'Agustus' },
  { startDate: 'September', endDate: 'Oktober' },
];

// Dummy mahasiswa
export const dummyMahasiswaList: Mahasiswa[] = [
  {
    id: '1',
    nama: 'John Doe',
    NIM: '111234567',
    jurusan: 'Sastra Mesin',
    profilePhoto: '/images/placeholder/profile-pic.png',
    divisi: 'UI/UX',
  },
  {
    id: '2',
    nama: 'Jane Smith',
    NIM: '111234568',
    jurusan: 'Teknik Informatika',
    profilePhoto: '/images/placeholder/profile-pic.png',
    divisi: 'Frontend',
  },
  {
    id: '3',
    nama: 'Michael Johnson',
    NIM: '111234569',
    jurusan: 'Sistem Informasi',
    profilePhoto: '/images/placeholder/profile-pic.png',
    divisi: 'Backend',
  },
  {
    id: '4',
    nama: 'Emily Davis',
    NIM: '111234570',
    jurusan: 'Manajemen',
    profilePhoto: '/images/placeholder/profile-pic.png',
    divisi: 'Humas',
  },
  {
    id: '5',
    nama: 'Daniel Lee',
    NIM: '111234571',
    jurusan: 'Teknik Elektro',
    profilePhoto: '/images/placeholder/profile-pic.png',
    divisi: 'Mobile Dev',
  },
  {
    id: '6',
    nama: 'Daniel Lee',
    NIM: '111234571',
    jurusan: 'Teknik Elektro',
    profilePhoto: '/images/placeholder/profile-pic.png',
    divisi: 'Mobile Dev',
  },
  {
    id: '7',
    nama: 'Daniel Lee',
    NIM: '111234571',
    jurusan: 'Teknik Elektro',
    profilePhoto: '/images/placeholder/profile-pic.png',
    divisi: 'Mobile Dev',
  },
  {
    id: '8',
    nama: 'Daniel Lee',
    NIM: '111234571',
    jurusan: 'Teknik Elektro',
    profilePhoto: '/images/placeholder/profile-pic.png',
    divisi: 'Mobile Dev',
  },
  {
    id: '9',
    nama: 'Daniel Lee',
    NIM: '111234571',
    jurusan: 'Teknik Elektro',
    profilePhoto: '/images/placeholder/profile-pic.png',
    divisi: 'Mobile Dev',
  },
  {
    id: '10',
    nama: 'Daniel Lee',
    NIM: '111234571',
    jurusan: 'Teknik Elektro',
    profilePhoto: '/images/placeholder/profile-pic.png',
    divisi: 'Mobile Dev',
  },
  {
    id: '11',
    nama: 'Daniel Lee',
    NIM: '111234571',
    jurusan: 'Teknik Elektro',
    profilePhoto: '/images/placeholder/profile-pic.png',
    divisi: 'Mobile Dev',
  },
  {
    id: '12',
    nama: 'Daniel Lee',
    NIM: '111234571',
    jurusan: 'Teknik Elektro',
    profilePhoto: '/images/placeholder/profile-pic.png',
    divisi: 'Mobile Dev',
  },
  {
    id: '13',
    nama: 'Daniel Lee',
    NIM: '111234571',
    jurusan: 'Teknik Elektro',
    profilePhoto: '/images/placeholder/profile-pic.png',
    divisi: 'Mobile Dev',
  },
  {
    id: '14',
    nama: 'Daniel Lee',
    NIM: '111234571',
    jurusan: 'Teknik Elektro',
    profilePhoto: '/images/placeholder/profile-pic.png',
    divisi: 'Mobile Dev',
  },
];
