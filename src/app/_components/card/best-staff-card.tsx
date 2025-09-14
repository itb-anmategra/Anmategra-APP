import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import dummyProfile from 'public/images/placeholder/profile-pic.png';
import { Card } from "~/components/ui/card";

// const dummyData = {
//   nama: 'John Doe',
//   NIM: '111234567',
//   jurusan: 'Sastra Mesin',
//   profilePhoto: dummyProfile,
//   divisi: 'UI/UX'
// }

const YellowStarIcon = (props) => {
  return (
    <svg width="36" height="33" viewBox="0 0 36 33" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M18 0L22.0413 12.4377H35.119L24.5389 20.1246L28.5801 32.5623L18 24.8754L7.41987 32.5623L11.4611 20.1246L0.880983 12.4377H13.9587L18 0Z" fill="#F5CB69"/>
    </svg>
  )
}

interface BestStaffCardProps {
  nama: string;
  NIM: string;
  jurusan: string;
  profilePicture: StaticImageData | string;
  divisi: string;
  id_mahasiswa: string;
}

export default function BestStaffCard({
  nama = 'John Doe',
  NIM = '111234567',
  jurusan = 'Sastra Mesin',
  profilePicture = dummyProfile,
  divisi = 'UI/UX',
  id_mahasiswa = '1'
} : BestStaffCardProps) {
  return (
    <Link href={`/lembaga/profile-mahasiswa/${id_mahasiswa}`} className="no-underline">
      <Card className="w-60 h-[200px] rounded-[20px] bg-white hover:bg-[#00B7B7] group border border-[#E0E5E8] flex flex-col items-center justify-center hover:cursor-pointer">
        <div className="w-full h-full flex">
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            <div className="absolute top-[17px] left-[192px]">
              <YellowStarIcon />
            </div>
            <div className="flex flex-col items-center justify-center gap-y-[9px]">
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
    </Link>
  )
}