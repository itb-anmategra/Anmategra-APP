import BestStaffCard from '~/app/_components/card/best-staff-card';

import { dummyMahasiswaList } from '../../lembaga/profile-lembaga/[lembagaId]/histori/_components/dummy-histori';
import LayoutCarouselBestStaff from './layout-carousel-best-staff';

export default function CarouselBestStaff() {
  return (
    <LayoutCarouselBestStaff>
      {dummyMahasiswaList.map((mhs) => (
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
    </LayoutCarouselBestStaff>
  );
}
