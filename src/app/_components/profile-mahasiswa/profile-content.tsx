'use client';

// Library Import
import Image from 'next/image';
import Link from 'next/link';
// Asset Import
import LineIcon from 'public/icons/line-icon-2.png';
import WhatsappIcon from 'public/icons/wa-icon.png';
import NoKepanitiaan from 'public/images/miscellaneous/not-found-kepanitiaan.png';
import React, { useState } from 'react';
// Components Import
import { KepanitiaanCard } from '~/app/_components/card/kepanitiaan-card';
import CariKepanitiaanButton from '~/app/_components/profile-mahasiswa/cari-kepanitiaan-button';
import EditProfileDialog from '~/app/_components/profile-mahasiswa/edit-profile-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { cn } from '~/lib/utils';
import { mahasiswa } from '~/server/db/schema';
import { type Kepanitiaan } from '~/types/kepanitiaan';

import { type ProfileMahasiswaContentProps } from './constant';

const ProfileMahasiswaContent: React.FC<ProfileMahasiswaContentProps> = ({
  session,
  user_id,
  mahasiswaData,
  newestEvent,
  isLembagaView = false,
}) => {
  const [isEdit, setIsEdit] = useState(false);

  const baseHref = isLembagaView
    ? '/lembaga/profile-kegiatan'
    : 'mahasiswa/profile-kegiatan';

  return (
    <div
      className={cn(
        'w-full flex min-h-screen flex-col items-center',
        isLembagaView ? 'px-6' : 'pt-14 px-6',
      )}
    >
      <div className="max-w-7xl flex w-full flex-col gap-4 py-6">
        {/* Title and Search */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-neutral-1000">Beranda</h1>
          <p className="text-neutral-1000">Beranda / Mahasiswa</p>
        </div>

        {/* Profil Mahasiswa */}
        {!isEdit && (
          <div className="w-full flex items-center justify-center gap-x-6 pt-12 mb-6">
            <Avatar
              className={cn(
                'rounded-full',
                isLembagaView ? 'h-[180px] w-[180px]' : 'h-40 w-40',
              )}
            >
              <AvatarImage
                src={mahasiswaData?.user.image ?? ''}
                alt="Foto Profil"
                className="rounded-full object-cover"
              />
              <AvatarFallback className="text-4xl">
                {mahasiswaData?.user.name
                  ?.split(' ')
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-2xl text-[#181818] font-semibold mb-2">
                {mahasiswaData?.user.name}
              </p>
              <p className="text-[18px] text-neutral-600">
                {mahasiswaData?.mahasiswa.nim}
              </p>
              <p className="text-[18px] text-neutral-600">
                {mahasiswaData?.mahasiswa.jurusan} &#39;
                {mahasiswaData?.mahasiswa.angkatan}
              </p>
              <div className="flex items-center justify-start gap-x-10 pt-[18px]">
                <div className="flex items-center gap-x-2">
                  <Image
                    src={LineIcon}
                    alt="Line Messanger Icon"
                    width={18}
                    height={18}
                  />
                  {mahasiswaData?.mahasiswa.lineId ? (
                    <p>{mahasiswaData?.mahasiswa.lineId}</p>
                  ) : (
                    <p>-</p>
                  )}
                </div>

                <div className="flex items-center gap-x-2">
                  <Image
                    src={WhatsappIcon}
                    alt="Whatsapp Messanger Icon"
                    width={18}
                    height={18}
                  />
                  {mahasiswaData?.mahasiswa.whatsapp ? (
                    <p>{mahasiswaData?.mahasiswa.whatsapp}</p>
                  ) : (
                    <p>-</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <div
          className={cn(
            'flex items-center justify-center w-full',
            isEdit ? '' : '',
            isLembagaView ? '' : 'mt-6 mb-8',
          )}
        >
          {session?.user.id === user_id && (
            <div
              className={cn(
                'w-full flex',
                isEdit ? 'max-w-none' : 'max-w-[600px] h-[56px]',
              )}
            >
              <EditProfileDialog
                image={mahasiswaData?.user.image}
                nama={mahasiswaData?.user.name ?? ''}
                nim={mahasiswaData?.mahasiswa.nim.toString() ?? ''}
                jurusan={mahasiswaData?.mahasiswa.jurusan ?? ''}
                angkatan={mahasiswaData?.mahasiswa.angkatan.toString() ?? ''}
                line={mahasiswaData?.mahasiswa.lineId ?? ''}
                whatsapp={mahasiswaData?.mahasiswa.whatsapp ?? ''}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
              />
            </div>
          )}
        </div>

        {/* Kepanitiaan Terbaru */}
        {!isEdit && (
          <div className="space-y-4 pb-12 mt-[50px]">
            <h5 className="text-2xl font-semibold text-neutral-1000">
              Kepanitiaan Terbaru
            </h5>
            {newestEvent && newestEvent.length !== 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {newestEvent.map((item: Kepanitiaan) => (
                  // masukkin posisi ke sini
                  <Link key={item.id} href={`${baseHref}/${item.id}`}>
                    <KepanitiaanCard kepanitiaan={item} key={item.name} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="w-full py-16 flex flex-col items-center gap-y-4">
                {session?.user.id === user_id ? (
                  <>
                    <div className="text-center items-center flex flex-row gap-8">
                      <Image
                        src={NoKepanitiaan}
                        alt="Tidak Ada Anggota"
                        width={128}
                        height={128}
                      />
                      <div className="max-w-[400px] text-left">
                        <h5 className="text-2xl font-semibold text-slate-600">
                          Tidak Ada Informasi Kepanitiaan
                        </h5>
                        <p className="text-slate-400 mt-2">
                          Kami tidak dapat menemukan informasi kepanitiaan yang
                          diikuti, silahkan menambahkan jika ada
                        </p>
                      </div>
                    </div>
                    <CariKepanitiaanButton />
                  </>
                ) : (
                  <>
                    <div className="text-center items-center flex flex-row gap-8">
                      <Image
                        src={NoKepanitiaan}
                        alt="Tidak Ada Anggota"
                        width={128}
                        height={128}
                      />
                      <div className="max-w-[400px] text-left">
                        <h5 className="text-2xl font-semibold text-slate-600">
                          Tidak Ada Informasi Kepanitiaan
                        </h5>
                        <p className="text-slate-400 mt-2">
                          Kami tidak dapat menemukan informasi kepanitiaan yang
                          diikuti oleh mahasiswa ini
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileMahasiswaContent;
