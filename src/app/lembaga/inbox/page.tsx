import { api } from '~/trpc/server';

import InboxContent from './_components/inbox-content';

type PermintaanAsosiasi = {
  id: string;
  image: string | null;
  nama: string;
  jumlah: string;
  tujuan: string;
};

export default async function InboxPage() {
  const AssociationSummary = await api.lembaga.getAllRequestAssociationSummary({});

  const entries: PermintaanAsosiasi[] = AssociationSummary.map((item) => ({
    id: item.id,
    image: item.image,
    nama: item.name,
    jumlah: item.total_requests as unknown as string,
    tujuan: item.type,
  }));

  return <InboxContent entries={entries} />;
}
