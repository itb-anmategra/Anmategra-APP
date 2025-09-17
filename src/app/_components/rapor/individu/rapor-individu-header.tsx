import Image, { type StaticImageData } from "next/image";
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import LineIcon from 'public/icons/line-icon-2.png';
import WAIcon from 'public/icons/wa-icon.png';
import dummyProfile from 'public/images/placeholder/profile-pic.png';

interface RaporIndividuHeaderProps {
  profilePictureLembaga: string | null;
  lembagaName: string;
  kegiatanName?: string;
  profilePictureIndividu: StaticImageData | string;
  individuName: string;
  individuNIM: string;
  individuJurusan: string;
  individuDivisi: string;
  individuPosisi: string;
  individuLine: string;
  individuWA: string;
}

export default function RaporIndividuHeader({
  profilePictureLembaga = null,
  lembagaName = "HMIF ITB",
  kegiatanName = "WISUDA OKTOBER 2024",
  profilePictureIndividu = dummyProfile,
  individuName = "Bennaya Jonathan Raja Partogi Siagian",
  individuNIM = "12345678",
  individuJurusan = "Teknik Informatika",
  individuDivisi = "Divisi Pengembangan Sumber Daya Manusia",
  individuPosisi = "Staff",
  individuLine = "bennaya.jonathan",
  individuWA = "081234567890",
} : RaporIndividuHeaderProps) {
  return (
    <div className="flex flex-col items-start justify-center gap-8">
      <div className="flex flex-row items-center justify-start w-full mt-1 gap-4">
        <div
          className="flex w-fit items-center justify-center gap-2 rounded-full bg-primary-400 px-3 py-1 text-[0.7rem] text-white">
          <Avatar className="size-4 bg-white">
              <AvatarImage
                  className="object-contain"
                  src={profilePictureLembaga ?? "/images/logo/hmif-logo.png"}
              />
              <AvatarFallback>
                  {lembagaName.slice(0, 2)}
              </AvatarFallback>
          </Avatar>
          <span className="line-clamp-1 font-semibold">{lembagaName}</span>
        </div>

        <div className="font-bold text-2xl text-[#2B6282] items-center justify-center">
          {kegiatanName}
        </div>
      </div>
      
      <div className="flex flex-row items-start justify-start w-full">
        <div className="max-w-[866px] flex flex-row items-center justify-start gap-10">
          <div className="flex flex-col min-w-40 max-w-40 min-h-40 max-h-40 rounded-full overflow-hidden ml-[27px] border">
            <Image 
              src={profilePictureIndividu ?? dummyProfile}
              alt="Profile Picture"
              width={160}
              height={160}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col items-start justify-start">
            <div className="flex my-2 items-center justify-start">
              <div className="text-2xl font-semibold text-[#181818]">
                {individuName}
              </div>
            </div>

            <div className="flex flex-row gap-[50px] items-start justify-start mb-[18px]">
              <div className="flex flex-col items-start justify-start">
                <div className="text-[18px] text-">NIM</div>
                <div className="text-[18px] text-neutral-800">
                  {individuNIM}
                </div>
              </div>

              <div className="flex flex-col items-start justify-start">
                <div className="text-[18px] text-">Jurusan</div>
                <div className="text-[18px] text-neutral-800">
                  {individuJurusan}
                </div>
              </div>

              <div className="flex flex-col items-start justify-start">
                <div className="text-[18px] text-">Divisi</div>
                <div className="text-[18px] text-neutral-800">
                  {individuDivisi}
                </div>
              </div>

              <div className="flex flex-col items-start justify-start">
                <div className="text-[18px] text-">Posisi</div>
                <div className="text-[18px] text-neutral-800">
                  {individuPosisi}
                </div>
              </div>
            </div>

            <div className="flex flex-row items-start justify-start gap-20">
              <div className="flex flex-row gap-[5px] items-center justify-start">
                <div className="w-[18px] h-[18px] relative">
                  <Image
                    src={LineIcon}
                    alt="Line Icon"
                    width={18}
                    height={18}
                    className="w-full h-full invert opacity-60"
                    style={{ filter: "brightness(0.5)" }}
                  />
                </div>
                <div className="text-[18px] text-neutral-600">
                  {individuLine}
                </div>
              </div>
              <div className="flex flex-row gap-[5px] items-center justify-start">
                <div className="w-[18px] h-[18px] relative">
                  <Image
                    src={WAIcon}
                    alt="WA Icon"
                    width={18}
                    height={18}
                    className="w-full h-full invert opacity-60"
                    style={{ filter: "brightness(0.5)" }}
                  />
                </div>
                <div className="text-[18px] text-neutral-600">
                  {individuWA}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Button variant="light_blue" className="ml-5">
            Unduh Rapor
          </Button>
        </div>
      </div>
    </div>
  )
}