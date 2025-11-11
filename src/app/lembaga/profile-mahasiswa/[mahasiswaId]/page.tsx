import React from 'react';
// Components Import
import ProfileMahasiswaContent from '~/app/_components/profile-mahasiswa/profile-content';
// Auth
import { getServerAuthSession } from '~/server/auth';
// API Import
import { api } from '~/trpc/server';

const DetailMahasiswaPage = async ({
  params,
}: {
  params: Promise<{ mahasiswaId: string }>;
}) => {
  const userId = (await params).mahasiswaId;
  const { mahasiswaData, newestEvent } = await api.profile.getMahasiswa({
    mahasiswaId: userId,
  });
  const session = await getServerAuthSession();

  return (
    <ProfileMahasiswaContent
      session={session}
      userId={userId}
      mahasiswaData={mahasiswaData}
      newestEvent={newestEvent}
      isLembagaView={true}
    />
  );
};

export default DetailMahasiswaPage;
