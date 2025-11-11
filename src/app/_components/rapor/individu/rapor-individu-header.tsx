'use client';

import Image from 'next/image';
import LineIcon from 'public/icons/line-icon-2.png';
import WAIcon from 'public/icons/wa-icon.png';
import dummyProfile from 'public/images/placeholder/profile-pic.png';
import React, { useState } from 'react';
import { type z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  type UpsertNilaiMahasiswaKegiatanInputSchema,
  type UpsertNilaiMahasiswaLembagaInputSchema,
} from '~/server/api/types/rapor.type';
import { type GetNilaiKegiatanIndividuOutputSchema } from '~/server/api/types/rapor.type';
import { api } from '~/trpc/react';

import { type NilaiProfilCardType } from '../../card/nilai-profil-card';
import FormNilaiProfil from '../../form/form-nilai-profil';
import NilaiProfilComp from './nilai-profil-comp';

type NilaiKegiatanOutput = z.infer<typeof GetNilaiKegiatanIndividuOutputSchema>;

export type HeaderDataProps = {
  dataNilaiProfil: NilaiKegiatanOutput | null;
  id: string;
  isLembaga?: boolean;
};

export default function RaporIndividuHeader({
  dataNilaiProfil,
  id,
  isLembaga,
}: HeaderDataProps) {
  const [nilaiProfilData, setNilaiProfilData] = useState<NilaiProfilCardType[]>(
    dataNilaiProfil?.nilai ?? [],
  );

  const upsertMutationLembaga =
    api.rapor.upsertNilaiMahasiswaLembaga.useMutation();

  const upsertMutationKegiatan =
    api.rapor.upsertNilaiMahasiswaKegiatan.useMutation();

  const handleUpdateNilaiProfilChange = (
    updatedProfiles: NilaiProfilCardType[],
  ) => {
    setNilaiProfilData(updatedProfiles);
    if (isLembaga) {
      const upsertData = {
        mahasiswa: [
          {
            user_id: dataNilaiProfil?.user_id ?? '',
            nilai: updatedProfiles.map((p) => ({
              profil_id: p.profil_id,
              nilai: p.nilai ?? 0,
            })),
          },
        ],
      } satisfies z.infer<typeof UpsertNilaiMahasiswaLembagaInputSchema>;
      upsertMutationLembaga.mutate(upsertData);
    } else {
      const upsertData = {
        event_id: id ?? '',
        mahasiswa: [
          {
            user_id: dataNilaiProfil?.user_id ?? '',
            nilai: updatedProfiles.map((p) => ({
              profil_id: p.profil_id,
              nilai: p.nilai ?? 0,
            })),
          },
        ],
      } satisfies z.infer<typeof UpsertNilaiMahasiswaKegiatanInputSchema>;
      upsertMutationKegiatan.mutate(upsertData);
    }
  };

  const mahasiswaOutput = api.users.getMahasiswaByNim.useQuery({
    nim: dataNilaiProfil?.nim ?? '',
  });

  let lembagaImage = '';
  let lembagaName = '';
  let kegiatanName = '';
  if (isLembaga) {
    const lembagaOutput = api.profile.getLembaga.useQuery({
      lembagaId: id ?? '',
    });
    lembagaImage = lembagaOutput.data?.lembagaData.users.image ?? '';
    lembagaName = lembagaOutput.data?.lembagaData.name ?? '';
  } else {
    const kegiatanOutput = api.profile.getKegiatan.useQuery({
      kegiatanId: id ?? '',
    });
    lembagaImage = kegiatanOutput.data?.lembaga.image ?? '';
    lembagaName = kegiatanOutput.data?.lembaga.name ?? '';
    kegiatanName = kegiatanOutput.data?.kegiatan.name ?? '';
  }

  return (
    <div className="flex flex-col items-start justify-center">
      <div className="flex flex-row items-center justify-start w-full mt-1 gap-4 mb-8">
        <div className="flex w-fit items-center justify-center gap-2 rounded-full bg-primary-400 px-3 py-1 text-[0.7rem] text-white">
          <Avatar className="size-4 bg-white">
            <AvatarImage
              className="object-contain"
              src={lembagaImage ?? '/images/logo/hmif-logo.png'}
            />
            <AvatarFallback>{lembagaName.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <span className="line-clamp-1 font-semibold">{lembagaName}</span>
        </div>

        {!isLembaga && (
          <div className="font-bold text-2xl text-[#2B6282] items-center justify-center">
            {kegiatanName ?? ''}
          </div>
        )}
      </div>

      <div className="flex flex-row items-start justify-start w-full mb-16">
        <div className="max-w-[866px] flex flex-row items-center justify-start gap-10 mx-[27px]">
          <div className="flex flex-col min-w-40 max-w-40 min-h-40 max-h-40 rounded-full overflow-hidden">
            <Image
              src={
                mahasiswaOutput.data?.mahasiswaData.user.image ?? dummyProfile
              }
              alt="Profile Picture"
              width={160}
              height={160}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col items-start justify-start">
            <div className="flex my-2 items-center justify-start">
              <div className="text-2xl font-semibold text-[#181818]">
                {dataNilaiProfil?.name}
              </div>
            </div>

            <div className="flex flex-row gap-[50px] items-start justify-start mb-[18px]">
              <div className="flex flex-col items-start justify-start">
                <div className="text-[18px] text-neutral-500">NIM</div>
                <div className="text-[18px] text-neutral-800">
                  {dataNilaiProfil?.nim}
                </div>
              </div>

              <div className="flex flex-col items-start justify-start">
                <div className="text-[18px] text-neutral-500">Jurusan</div>
                <div className="text-[18px] text-neutral-800">
                  {dataNilaiProfil?.jurusan}
                </div>
              </div>

              <div className="flex flex-col items-start justify-start">
                <div className="text-[18px] text-neutral-500">Divisi</div>
                <div className="text-[18px] text-neutral-800">
                  {dataNilaiProfil?.division}
                </div>
              </div>

              <div className="flex flex-col items-start justify-start">
                <div className="text-[18px] text-neutral-500">Posisi</div>
                <div className="text-[18px] text-neutral-800">
                  {dataNilaiProfil?.position}
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
                  {dataNilaiProfil?.lineId ?? '-'}
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
                <div className="text-[18px] text-neutral-600">
                  {dataNilaiProfil?.whatsapp ?? '-'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ml-5">
          <FormNilaiProfil
            initialProfiles={dataNilaiProfil?.nilai.map((profil) => ({
              id: profil.profil_id,
              value: profil.nilai ?? 0,
            }))}
            onSave={(updatedProfiles) => {
              const updatedNilaiProfils = updatedProfiles.map((p) => ({
                profil_id: p.id,
                nilai: p.value ?? 0,
              }));
              handleUpdateNilaiProfilChange(updatedNilaiProfils);
            }}
          />
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <NilaiProfilComp nilaiProfils={nilaiProfilData} isLembaga={isLembaga} />
      </div>
    </div>
  );
}
