import Image from 'next/image';
import { api } from '~/trpc/server';

import InboxDetailContent from '../_components/inbox-detail-content';

// import { apiBaseUrl } from 'next-auth/client/_utils';

type PermintaanAsosiasiUser = {
  id: string;
  image: string;
  nama: string;
  user_id: string;
  posisi: string;
  divisi: string;
};

export default async function InboxPageWithParams({
  params,
}: {
  params: { slug: string };
}) {
  const lembagaAssociationRequestEntries =
    await api.lembaga.getAllRequestAssociationLembaga();
  const eventAssociationRequestEntries =
    await api.lembaga.getAllRequestAssociation();

  const lembagaAssociationImage = (
    await Promise.all(
      lembagaAssociationRequestEntries.requests.map(async (lembaga) => {
        const data = await api.users.getMahasiswaById({
          userId: lembaga.user_id,
        });
        return { [lembaga.user_id]: data.mahasiswaData.user.image };
      }),
    )
  ).reduce((id, image) => ({ ...id, ...image }), {});

  const eventAssociationImage = (
    await Promise.all(
      eventAssociationRequestEntries.map(async (event) => {
        const data = await api.users.getMahasiswaById({
          userId: event.user_id,
        });
        return { [event.user_id]: data.mahasiswaData.user.image };
      }),
    )
  ).reduce((id, image) => ({ ...id, ...image }), {});

  const entries: PermintaanAsosiasiUser[] = [
    ...lembagaAssociationRequestEntries.requests.map((lembaga) => ({
      id: 'lembaga',
      image:
        lembagaAssociationImage[lembaga.user_id] ??
        '/images/placeholder/profile-pic.png',
      nama: lembaga.mahasiswa_name,
      user_id: lembaga.user_id,
      posisi: lembaga.position,
      divisi: lembaga.division,
    })),
    ...eventAssociationRequestEntries.map((event) => ({
      id: event.event_id,
      image:
        eventAssociationImage[event.user_id] ??
        '/images/placeholder/profile-pic.png',
      nama: event.mahasiswa_name,
      user_id: event.user_id,
      posisi: event.position,
      divisi: event.division,
    })),
  ];

  const id = params.slug;
  const filteredRequests = entries.filter((entry) => entry.id === id);

  return <InboxDetailContent id={id} data={filteredRequests} />;
}
