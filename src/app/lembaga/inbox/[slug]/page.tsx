import Image from 'next/image';
import { Input } from '~/components/ui/input';
import { api } from '~/trpc/server';

import RequestTableAssociationsEntries from '../_components/request-table-associations-entries';

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
              placeholder="Cari nama pemohon"
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
          <RequestTableAssociationsEntries id={id} data={filteredRequests} />
        </div>
      </div>
    </div>
  );
}
