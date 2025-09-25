'use client';

import Image from 'next/image';
import LineIcon from 'public/icons/line-icon-2.png';
import WAIcon from 'public/icons/wa-icon.png';
import dummyProfile from 'public/images/placeholder/profile-pic.png';
import React, { useState } from 'react';
import { type HeaderDataProps } from '~/app/lembaga/kegiatan/[kegiatanId]/panitia/[raporId]/page';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

import { type NilaiProfilCardType } from '../../card/nilai-profil-card';
import FormNilaiProfil from '../../form/form-nilai-profil';
import NilaiProfilComp from './nilai-profil-comp';

const dummyNilaiProfils: NilaiProfilCardType[] = [
  { idProfil: 'Profil 1', nilaiProfil: 100 },
  { idProfil: 'Profil 2', nilaiProfil: 90 },
  { idProfil: 'Profil 3', nilaiProfil: 95 },
  { idProfil: 'Profil 4', nilaiProfil: 85 },
  { idProfil: 'Profil 5', nilaiProfil: 80 },
  { idProfil: 'Profil 6', nilaiProfil: 75 },
  { idProfil: 'Profil 7', nilaiProfil: 70 },
  { idProfil: 'Profil 8', nilaiProfil: 65 },
];

export default function RaporIndividuHeader({
  profilePictureLembaga = '/images/logo/hmif-logo.png',
  lembagaName = 'HMIF ITB',
  kegiatanName = 'WISUDA OKTOBER 2024',
  profilePictureIndividu = '',
  individuName = 'John Doe',
  individuNIM = '12345678',
  individuJurusan = 'Sastra Mesin',
  individuDivisi = 'UI/UX',
  individuPosisi = 'Staff',
  individuLine = 'john_doe',
  individuWA = '081234567890',
  nilaiProfils = dummyNilaiProfils,
}: HeaderDataProps) {
  const [nilaiProfilData, setNilaiProfilData] =
    useState<NilaiProfilCardType[]>(nilaiProfils);
  const handleUpdateNilaiProfilChange = (
    updatedProfiles: NilaiProfilCardType[],
  ) => {
    setNilaiProfilData(updatedProfiles);
  };

  return (
    <div className="flex flex-col items-start justify-center">
      <div className="flex flex-row items-center justify-start w-full mt-1 gap-4 mb-8">
        <div className="flex w-fit items-center justify-center gap-2 rounded-full bg-primary-400 px-3 py-1 text-[0.7rem] text-white">
          <Avatar className="size-4 bg-white">
            <AvatarImage
              className="object-contain"
              src={profilePictureLembaga ?? '/images/logo/hmif-logo.png'}
            />
            <AvatarFallback>{lembagaName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="line-clamp-1 font-semibold">{lembagaName}</span>
        </div>

        <div className="font-bold text-2xl text-[#2B6282] items-center justify-center">
          {kegiatanName}
        </div>
      </div>

      <div className="flex flex-row items-start justify-start w-full mb-16">
        <div className="max-w-[866px] flex flex-row items-center justify-start gap-10 mx-[27px]">
          <div className="flex flex-col min-w-40 max-w-40 min-h-40 max-h-40 rounded-full overflow-hidden">
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
                <div className="text-[18px] text-neutral-500">NIM</div>
                <div className="text-[18px] text-neutral-800">
                  {individuNIM}
                </div>
              </div>

              <div className="flex flex-col items-start justify-start">
                <div className="text-[18px] text-neutral-500">Jurusan</div>
                <div className="text-[18px] text-neutral-800">
                  {individuJurusan}
                </div>
              </div>

              <div className="flex flex-col items-start justify-start">
                <div className="text-[18px] text-neutral-500">Divisi</div>
                <div className="text-[18px] text-neutral-800">
                  {individuDivisi}
                </div>
              </div>

              <div className="flex flex-col items-start justify-start">
                <div className="text-[18px] text-neutral-500">Posisi</div>
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
                    style={{ filter: 'brightness(0.5)' }}
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
                    style={{ filter: 'brightness(0.5)' }}
                  />
                </div>
                <div className="text-[18px] text-neutral-600">{individuWA}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="ml-5">
          <FormNilaiProfil
            initialProfiles={nilaiProfils.map((profil, index) => ({
              id: index + 1,
              value: profil.nilaiProfil ?? 0,
            }))}
            onSave={(updatedProfiles) => {
              const updatedNilaiProfils = updatedProfiles.map((p, idx) => ({
                idProfil: `Profil ${idx + 1}`,
                nilaiProfil: p.value ?? 0,
              }));
              handleUpdateNilaiProfilChange(updatedNilaiProfils);
            }}
          />
        </div>
      </div>

      <div className="overflow-x-auto w-full px-10">
        <NilaiProfilComp nilaiProfils={nilaiProfilData} />
      </div>
    </div>
  );
}
