import { type z } from 'zod';
import { type GetAllRequestAssociationOutputSchema } from '~/server/api/types/lembaga.type';
import { type GetAllRequestAssociationLembagaOutputSchema } from '~/server/api/types/lembaga.type';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';

import RequestTableEvents from './_components/request-table-events';

type PermintaanAsosiasi = {
  id: string;
  image: string;
  nama: string;
  jumlah: string;
  tujuan: string;
};

export default async function InboxPage() {
  const session = await getServerAuthSession();

  const lembagaAssociationRequestEntries =
    await api.lembaga.getAllRequestAssociationLembaga();
  type LembagaAssociationRequest = z.infer<
    typeof GetAllRequestAssociationLembagaOutputSchema
  >;
  const lembagaRequest =
    lembagaAssociationRequestEntries;

  const eventAssociationRequestEntries =
    await api.lembaga.getAllRequestAssociation();
  type EventAssociationRequest = z.infer<
    typeof GetAllRequestAssociationOutputSchema
  >;
  const eventRequest =
    eventAssociationRequestEntries;

  const entries: PermintaanAsosiasi[] = [
    ...lembagaRequest.requests.map((lembaga) => ({
      id: 'lembaga',
      image: '/images/miscellaneous/empty-profile-picture.svg',
      nama: 'HMIF',
      jumlah: '20',
      tujuan: 'Lembaga',
    })),
    ...eventRequest.map((event) => ({
      id: event.event_id,
      image: '/images/miscellaneous/empty-profile-picture.svg',
      nama: event.event_name,
      jumlah: '20',
      tujuan: 'Kegiatan',
    })),
  ];

  return <RequestTableEvents Requests={entries} />;
}
