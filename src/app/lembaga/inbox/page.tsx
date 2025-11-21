import Image from 'next/image';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';

import InboxContent from './_components/inbox-content';

// import { Footer } from 'react-day-picker';
// import { requestAsyncStorage } from 'next/dist/client/components/request-async-storage-instance';

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
    await api.lembaga.getAllRequestAssociationLembaga({});
  const eventAssociationRequestEntries =
    await api.lembaga.getAllRequestAssociation({event_id: "event-44" });

  let lembagaInfo = { nama: '', foto: '' };
  let eventInfo = {} as Record<string, string>;

  const lembagaID = session?.user?.lembagaId;
  if (lembagaID) {
    const lembagaGetInfo = await api.lembaga.getInfo({ lembagaId: lembagaID });
    lembagaInfo = {
      nama: lembagaGetInfo.nama ?? 'Lembaga Tidak Diketahui',
      foto: lembagaGetInfo.foto ?? '/images/placeholder/rick1.jpg',
    };

    const eventGetInfo = await api.lembaga.getEvents({ lembagaId: lembagaID });
    eventInfo = eventGetInfo.events.reduce(
      (output, event) => {
        output[event.id] = event.poster ?? '/images/placeholder/rick1.jpg';
        return output;
      },
      {} as Record<string, string>,
    );
  }

  const lembagaEntries: PermintaanAsosiasi[] = [
    {
      id: 'lembaga',
      image: lembagaInfo.foto ?? '/images/placeholder/rick1.jpg',
      nama: lembagaInfo.nama,
      jumlah: lembagaAssociationRequestEntries.requests
        .length as unknown as string,
      tujuan: 'Lembaga',
    },
  ];

  const eventEntriesCounter = eventAssociationRequestEntries.reduce(
    (counter, event) => {
      counter[event.event_name] = (counter[event.event_name] ?? 0) + 1;
      return counter;
    },
    {} as Record<string, number>,
  );

  const eventEntries: PermintaanAsosiasi[] = Object.keys(
    eventEntriesCounter,
  ).map((eventName) => {
    const event = eventAssociationRequestEntries.find(
      (entry) => entry.event_name === eventName,
    );

    return {
      id: event?.event_id ?? 'unknown',
      image:
        eventInfo[event?.event_id ?? 'unknown'] ??
        '/images/placeholder/rick1.jpg',
      nama: eventName,
      jumlah: eventEntriesCounter[eventName] as unknown as string,
      tujuan: 'Kegiatan',
    };
  });

  const entries: PermintaanAsosiasi[] = [...lembagaEntries, ...eventEntries];

  return <InboxContent entries={entries} />;
}
