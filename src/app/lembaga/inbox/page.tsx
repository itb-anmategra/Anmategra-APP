import Image from 'next/image';
import { Input } from '~/components/ui/input';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/server';

import RequestTableEventsEntries from './_components/request-table-events-entries';

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
    await api.lembaga.getAllRequestAssociationLembaga();
  const eventAssociationRequestEntries =
    await api.lembaga.getAllRequestAssociation();

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

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <div className="flex-1 p-10">
        <h1 className="m-0 mb-3 text-[32px] weight-600 font-semibold">
          Permintaan Asosiasi
        </h1>

        <div className="flex items-center mb-5 gap-[18px]">
          <div className="flex-1 relative align-center">
            <Input
              type="text"
              placeholder="Cari nama lembaga atau kegiatan"
              className="w-full pl-[48px] border border-[#C4CACE] rounded-[20px] bg-white h-[50px] font-regular weight-400 text-[18px] text-[#636A6D]" // Kelas styling utama digantikan oleh komponen
            />
            <Image
              src="/icons/search.svg"
              alt="Search Icon"
              width={24}
              height={24}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 ml-1"
            />
          </div>

          <div className="p-3 px-4 border border-[#C4CACE] rounded-[16px] cursor-pointer bg-[#FFFFFF] text-weight-600 font-semibold hover:bg-gray-100 flex items-center gap-2">
            <Image
              src="/icons/filter.svg"
              alt="Filter Icon"
              width={24}
              height={24}
            />
            Filter
          </div>
        </div>

        <div>
          <RequestTableEventsEntries data={entries} />
        </div>
      </div>
    </div>
  );
}
