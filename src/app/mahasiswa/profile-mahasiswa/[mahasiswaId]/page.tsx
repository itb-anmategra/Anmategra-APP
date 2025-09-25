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
import ProfileMahasiswaContent from '~/app/_components/profile-mahasiswa/profile-content';
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
    <ProfileMahasiswaContent
      session={session}
      userId={userId}
      mahasiswaData={mahasiswaData}
      newestEvent={newestEvent}
      isLembagaView={false}
    />
  );
};

export default DetailMahasiswaPage;
