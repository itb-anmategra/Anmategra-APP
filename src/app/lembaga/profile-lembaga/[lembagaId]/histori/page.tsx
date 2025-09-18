import { ChevronRight, Icon, Pencil } from 'lucide-react';
import dummyProfile from 'public/images/placeholder/profile-pic.png';
import React from 'react';
import BestStaffCard from '~/app/_components/card/best-staff-card';
import BestStaff from '~/app/lembaga/kegiatan/[kegiatanId]/_components/best-staff-form';
import { Button } from '~/components/ui/button';

import { HistoriBreadCrumb } from './_components/histori-breadcrumb';

const dummyDate = [
  {
    startDate: 'Januari',
    endDate: 'Februari',
  },
  {
    startDate: 'Maret',
    endDate: 'April',
  },
  {
    startDate: 'Mei',
    endDate: 'Juni',
  },
  {
    startDate: 'Juli',
    endDate: 'Agustus',
  },
  {
    startDate: 'September',
    endDate: 'Oktober',
  },
];

const dummyMahasiswaList = [
  {
    nama: 'John Doe',
    NIM: '111234567',
    jurusan: 'Sastra Mesin',
    profilePhoto: dummyProfile,
    divisi: 'UI/UX',
    id: '1',
  },
  {
    nama: 'Jane Smith',
    NIM: '111234568',
    jurusan: 'Teknik Informatika',
    profilePhoto: dummyProfile,
    divisi: 'Frontend',
    id: '2',
  },
  {
    nama: 'Michael Johnson',
    NIM: '111234569',
    jurusan: 'Sistem Informasi',
    profilePhoto: dummyProfile,
    divisi: 'Backend',
    id: '3',
  },
  {
    nama: 'Emily Davis',
    NIM: '111234570',
    jurusan: 'Manajemen',
    profilePhoto: dummyProfile,
    divisi: 'Humas',
    id: '4',
  },
  {
    nama: 'Daniel Lee',
    NIM: '111234571',
    jurusan: 'Teknik Elektro',
    profilePhoto: dummyProfile,
    divisi: 'Mobile Dev',
    id: '5',
  },
];

const HistoriBestStaffPage = () => {
  const namaLembaga = 'HMIF ITB';

  return (
    <div className="absolute left-[338px] top-[68px] w-[1066px] flex flex-col gap-6 text-[#141718]">
      <div>
        <h1 className="font-semibold text-[32px]">{namaLembaga}</h1>{' '}
        {/*Dapat disesuaikan*/}
        <HistoriBreadCrumb
          items={[
            { label: 'Beranda', href: '/lembaga' },
            { label: 'Lembaga', href: `/lembaga/profile-lembaga/uuid-hmif` },
            {
              label: 'Histori',
              href: `/lembaga/profile-lembaga/uuid-hmif/histori`,
            },
          ]}
        />
      </div>
      <div className="flex flex-col gap-[50px]">
        {dummyDate.map((item, id) => (
          <div key={id} className="flex flex-col gap-3">
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-2xl font-semibold">
                Best Staff Periode {item.startDate}–{item.endDate} 2025
              </h2>
              <BestStaff
                trigger={
                  <Button
                    variant={'dark_blue'}
                    className="rounded-xl gap-2 p-3"
                  >
                    <Pencil className="w-6 h-6" />
                    <h3 className="font-semibold text-[18px]">
                      Edit Best Staff
                    </h3>
                  </Button>
                }
              />
            </div>

            <div className="flex flex-row gap-[17px] items-center">
              {dummyMahasiswaList.slice(0, 4).map((mhs, idx) => (
                <BestStaffCard
                  key={mhs.id}
                  nama={mhs.nama}
                  NIM={mhs.NIM}
                  jurusan={mhs.jurusan}
                  profilePicture={mhs.profilePhoto}
                  divisi={mhs.divisi}
                  id_mahasiswa={mhs.id}
                />
              ))}
              <Button variant={'light_blue'} size={'icon'}>
                <ChevronRight width={12} height={21} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6"></div>
    </div>
  );
};

export default HistoriBestStaffPage;
