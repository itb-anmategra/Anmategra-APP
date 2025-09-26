import { type z } from 'zod';
import { type GetAllRequestAssociationOutputSchema } from '~/server/api/types/lembaga.type';
import { type GetAllRequestAssociationLembagaOutputSchema } from '~/server/api/types/lembaga.type';
import { api } from '~/trpc/server';

import RequestTableAssociations from '../_components/request-table-associations';

type PermintaanAsosiasiUser = {
  id: string;
  image: string;
  nama: string;
  user_id: string;
  posisi: string;
  divisi: string;
};

const InboxPageWithParams = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const lembagaAssociationRequestEntries =
    await api.lembaga.getAllRequestAssociationLembaga();
  type LembagaAssociationRequest = z.infer<
    typeof GetAllRequestAssociationLembagaOutputSchema
  >;
  const lembagaRequest = lembagaAssociationRequestEntries;

  const eventAssociationRequestEntries =
    await api.lembaga.getAllRequestAssociation();
  type EventAssociationRequest = z.infer<
    typeof GetAllRequestAssociationOutputSchema
  >;
  const eventRequest = eventAssociationRequestEntries;

  const entries: PermintaanAsosiasiUser[] = [
    ...lembagaRequest.requests.map((lembaga) => ({
      id: 'lembaga',
      image: '/images/miscellaneous/empty-profile-picture.svg',
      nama: lembaga.mahasiswa_name,
      user_id: lembaga.user_id,
      posisi: lembaga.position,
      divisi: lembaga.division,
    })),
    ...eventRequest.map((event) => ({
      id: event.event_id,
      image: '/images/miscellaneous/empty-profile-picture.svg',
      nama: event.mahasiswa_name,
      user_id: event.user_id,
      posisi: event.position,
      divisi: event.division,
    })),
  ];

  return <RequestTableAssociations requests={entries} id={params.slug} />;
};

export default InboxPageWithParams;
