// Library Import
import Image from 'next/image';
import Link from 'next/link';
// Asset Import
import LineIcon from 'public/icons/line-icon-2.png';
import WhatsappIcon from 'public/icons/wa-icon.png';
import NoKepanitiaan from 'public/images/miscellaneous/not-found-kepanitiaan.png';
import React from 'react';
// Components Import
import { KepanitiaanCard } from '~/app/_components/card/kepanitiaan-card';
import CariKepanitiaanButton from '~/app/_components/profile-mahasiswa/cari-kepanitiaan-button';
import EditProfileDialog from '~/app/_components/profile-mahasiswa/edit-profile-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
// Auth
import { getServerAuthSession } from '~/server/auth';
// API Import
import { api } from '~/trpc/server';
// Types Import
import { type Kepanitiaan } from '~/types/kepanitiaan';

const DetailMahasiswaPage = async ({
  params,
}: {
  params: Promise<{ mahasiswaId: string }>;
}) => {
  const userId = (await params).mahasiswaId;
  const { mahasiswaData, newestEvent } = await api.profile.getMahasiswa({
    mahasiswaId: userId,
  });
  // console.log(newestEvent)
  // newwestEvent tolong return posisi mahasiswanya, terus masukkin ke kepanitiaan card
  const session = await getServerAuthSession();
  return (
    <>
      <div className="w-full flex min-h-screen flex-col items-center pt-14">
        <div className="max-w-7xl flex w-full flex-col gap-4 py-6">
          {/* Title and Search */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-slate-600">Beranda</h1>
            <p className="text-slate-400">Beranda / Mahasiswa</p>
          </div>

          {/* Profil Mahasiswa */}
          <div className="w-full flex items-center justify-center gap-x-6 py-12">
            <Avatar className="rounded-full size-[200px]">
              <AvatarImage
                // @ts-expect-error karena src ini ada null nya, gatau qiya skill issue
                src={mahasiswaData?.user.image}
                alt="Foto Profil"
                className="rounded-full min-w-[200px] min-h-[200px] max-w-[200px] max-h-[200px] object-cover"
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
              <p className="text-3xl text-slate-700 font-semibold">
                {mahasiswaData?.user.name}
              </p>
              <p className="text-[18px] text-slate-600 font-medium">
                {mahasiswaData?.mahasiswa.nim}
              </p>
              <p className="text-[18px] text-slate-500">
                {mahasiswaData?.mahasiswa.jurusan} &#39;
                {mahasiswaData?.mahasiswa.angkatan}
              </p>
              <div className="flex items-center justify-start gap-x-10 pt-4">
                {mahasiswaData?.mahasiswa.lineId ? (
                  <div className="flex items-center gap-x-2">
                    <Image
                      src={LineIcon}
                      alt="Line Messanger Icon"
                      width={20}
                      height={20}
                    />
                    <p>{mahasiswaData?.mahasiswa.lineId}</p>
                  </div>
                ) : (
                  <></>
                )}
                {mahasiswaData?.mahasiswa.whatsapp ? (
                  <div className="flex items-center gap-x-2">
                    <Image
                      src={WhatsappIcon}
                      alt="Whatsapp Messanger Icon"
                      width={20}
                      height={20}
                    />
                    <p>{mahasiswaData?.mahasiswa.whatsapp}</p>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            {session?.user.id === userId && (
              <div className="w-full flex items-end justify-end max-w-3xl">
                <EditProfileDialog
                  image={mahasiswaData?.user.image}
                  line={mahasiswaData?.mahasiswa.lineId ?? ''}
                  whatsapp={mahasiswaData?.mahasiswa.whatsapp ?? ''}
                />
              </div>
            )}
          </div>

          {/* Kepanitiaan Terbaru */}
          <div className="space-y-4 pb-12">
            <h5 className="text-2xl font-semibold text-slate-600">
              Kepanitiaan Terbaru
            </h5>
            {newestEvent && newestEvent.length !== 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {newestEvent.map((item: Kepanitiaan) => (
                  // masukkin posisi ke sini
                  <Link
                    key={item.id}
                    href={`/mahasiswa/profile-kegiatan/${item.id}`}
                  >
                    <KepanitiaanCard kepanitiaan={item} key={item.name} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="w-full py-16 flex flex-col items-center gap-y-4">
                {session?.user.id === userId ? (
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
        </div>
      </div>
    </>
  );
};

export default DetailMahasiswaPage;
