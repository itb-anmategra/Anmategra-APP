import Image, { type StaticImageData } from "next/image";
import dummyProfile from 'public/images/placeholder/profile-pic.png';
import YellowStar from 'public/icons/star-yellow.png';

import { Card } from "~/components/ui/card";

// const dummyData = {
//   nama: 'John Doe',
//   NIM: '111234567',
//   jurusan: 'Sastra Mesin',
//   profilePhoto: dummyProfile,
//   divisi: 'UI/UX'
// }

interface BestStaffCardProps {
  nama: string;
  NIM: string;
  jurusan: string;
  profilePicture: StaticImageData | string;
  divisi: string;
}

export default function BestStaffCard({
  nama = 'John Doe',
  NIM = '111234567',
  jurusan = 'Sastra Mesin',
  profilePicture = dummyProfile,
  divisi = 'UI/UX'
} : BestStaffCardProps) {
  return (
    <Card className="w-60 h-[200px] rounded-[20px] bg-white hover:bg-[#00B7B7] group border border-[#E0E5E8] flex flex-col items-center justify-center hover:cursor-pointer">
      <div className="w-full h-full flex">
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          <div className="absolute top-[17px] left-[192px]">
            <Image 
              src={YellowStar} 
              alt="Star Icon" 
              width={36}
              height={36}
            />
          </div>
          <div className="flex flex-col items-center justify-center top-[27px] gap-y-[9px]">
            <Image 
              src={profilePicture}
              alt="Profile Picture"
              width={64}
              height={64}
              className="rounded-full object-cover border border-[#009292] group-hover:border-[#E0E5E8]"
            />

            <div className="text-center">
              <h1 className="font-bold text-lg text-[#009292] group-hover:text-white">{nama}</h1>
              <p className="text-[10px] text-[#141718] group-hover:text-white">{NIM} - {jurusan}</p>
              <h2 className="text-[16px] text-[#9DA4A8] font-semibold group-hover:text-white">{divisi}</h2>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}