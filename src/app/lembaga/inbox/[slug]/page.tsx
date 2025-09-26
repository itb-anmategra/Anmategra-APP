import { api } from '~/trpc/server';

import RequestsTable from '../_components/request-table';

export default async function InboxPage() {
  const associationRequestEntries =
    await api.lembaga.getAllRequestAssociation();
  const entries = associationRequestEntries ?? [];

  return <RequestsTable entries={entries} />;
}
