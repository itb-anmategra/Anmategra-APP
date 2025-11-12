import dummyProfile from 'public/images/placeholder/profile-pic.png';
import BestStaffCard from '~/app/_components/card/best-staff-card';

import LayoutCarouselBestStaff from './layout-carousel-best-staff';

type BestStaffMember = {
  user_id: string;
  name: string;
  image: string | null;
  nim: string;
  jurusan: string;
  division: string;
};

type CarouselBestStaffProps = {
  bestStaffList: BestStaffMember[];
};

export default function CarouselBestStaff({
  bestStaffList,
}: CarouselBestStaffProps) {
  // Handle empty or undefined list
  if (!bestStaffList || bestStaffList.length === 0) {
    return (
      <div className="w-full p-8 border border-dashed border-slate-300 rounded-lg text-center">
        <p className="text-slate-500">Tidak ada data Best Staff</p>
      </div>
    );
  }

  return (
    <LayoutCarouselBestStaff itemCount={bestStaffList.length}>
      {bestStaffList.map((staff) => (
        <BestStaffCard
          key={staff.user_id}
          nama={staff.name}
          NIM={staff.nim}
          jurusan={staff.jurusan}
          profilePicture={staff.image ?? dummyProfile}
          divisi={staff.division}
          id_mahasiswa={staff.user_id}
        />
      ))}
    </LayoutCarouselBestStaff>
  );
}
