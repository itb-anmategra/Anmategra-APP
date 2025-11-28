// Library Import
// Icons Import
import React from 'react';
// Components Import
import { getServerAuthSession } from '~/server/auth';
// TRPC Import
import { api } from '~/trpc/server';

import ProfileLembagaContent from './profile-lembaga-content';

const DetailLembagaPage = async ({
  params,
}: {
  params: Promise<{ lembagaId: string }>;
}) => {
  const session = await getServerAuthSession();
  const lembagaId = (await params).lembagaId;
  const { lembagaData, newestEvent, highlightedEvent, anggota } =
    await api.profile.getLembaga({ lembagaId: lembagaId });

  let latestBestStaff: {
    start_date: string;
    end_date: string;
    best_staff_list: {
      user_id: string;
      name: string;
      image: string | null;
      nim: string;
      jurusan: string;
      division: string;
    }[];
  } | null = null;
  try {
    latestBestStaff = await api.lembaga.getLatestBestStaffLembaga({
      lembaga_id: lembagaId,
    });
    console.log('Best staff data loaded:', latestBestStaff);
  } catch (error) {
    // No best staff data available yet
    console.log('No best staff data available for lembaga:', lembagaId, error);
  }

  return (
    <ProfileLembagaContent
      lembagaId={lembagaId}
      session={session}
      lembagaData={lembagaData}
      newestEvent={newestEvent}
      highlightedEvent={highlightedEvent}
      anggota={anggota}
      latestBestStaff={latestBestStaff}
      isLembaga={true}
    />
  );
};

export default DetailLembagaPage;
