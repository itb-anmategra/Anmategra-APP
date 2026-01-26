// Asset Import
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
  const { mahasiswaData, newestEvent, memberLembaga } = await api.profile.getMahasiswa({
    mahasiswaId: userId,
  });
  // console.log(newestEvent)
  // newwestEvent tolong return posisi mahasiswanya, terus masukkin ke kepanitiaan card
  const session = await getServerAuthSession();
  
  let bestStaffData: Awaited<ReturnType<typeof api.lembaga.getAllHistoryBestStaffMahasiswa>> | null = null;
  try {
    bestStaffData = await api.lembaga.getAllHistoryBestStaffMahasiswa({
      mahasiswa_id: userId,
    });
  } catch (error) {
    // console.log('No best staff data available for mahasiswa:', userId, error);
  }
  
  return (
    <ProfileMahasiswaContent
      session={session}
      userId={userId}
      mahasiswaData={mahasiswaData}
      newestEvent={newestEvent}
      memberLembaga={memberLembaga}
      isLembagaView={false}
      bestStaffData={bestStaffData}
    />
  );
};

export default DetailMahasiswaPage;
