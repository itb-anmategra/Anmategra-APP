// Library Import
import Image from 'next/image';
import Link from 'next/link';
// Asset Import
import LineIcon from 'public/icons/line-icon-2.png';
import WhatsappIcon from 'public/icons/wa-icon.png';
import React from 'react';
// Components Import
import { KepanitiaanCard } from '~/app/_components/card/kepanitiaan-card';
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
  const user_id = (await params).mahasiswaId;
  const { mahasiswaData, newestEvent } = await api.profile.getMahasiswa({
    mahasiswaId: user_id,
  });
  const session = await getServerAuthSession();

  return (
    <ProfileMahasiswaContent
      session={session}
      user_id={user_id}
      mahasiswaData={mahasiswaData}
      newestEvent={newestEvent}
      isLembagaView={true}
    />
  );
};

export default DetailMahasiswaPage;
