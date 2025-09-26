'use client';

import Image from 'next/image';

import RequestTableAssociationsEntries from './request-table-associations-entries';

type PermintaanAsosiasiUser = {
  id: string;
  image: string;
  nama: string;
  user_id: string;
  posisi: string;
  divisi: string;
};

// const associationRequestEntries = [
//   {
//     image: '/images/miscellaneous/empty-profile-picture.svg',
//     nama: 'Jason Jahja',
//     posisi: 'Staff',
//     divisi: 'UI/UX',
//   },
//   {
//     image: '/images/miscellaneous/empty-profile-picture.svg',
//     nama: 'Jason Jahja',
//     posisi: 'Staff',
//     divisi: 'Back End',
//   },
//   {
//     image: '/images/miscellaneous/empty-profile-picture.svg',
//     nama: 'Jason Jahja',
//     posisi: 'Staff',
//     divisi: 'Front End',
//   },
//   {
//     image: '/images/miscellaneous/empty-profile-picture.svg',
//     nama: 'Jason Jahja',
//     posisi: 'Staff',
//     divisi: 'Marketing',
//   },
// ];

export default async function RequestTableAssociations({
  requests,
  id,
}: {
  requests: PermintaanAsosiasiUser[];
  id: string;
}) {
  const filteredRequests = requests.filter((entry) => entry.id === id);

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      <div className="flex-1 p-10">
        <h1 className="m-0 mb-3 text-[32px] weight-600 font-semibold">
          Permintaan Asosiasi
        </h1>

        <div className="flex items-center mb-5 gap-[18px]">
          <div className="flex-1 relative align-center">
            <input
              type="text"
              placeholder="Cari nama pemohon"
              className="w-full pl-[48px] p-3 border border-[#C4CACE] rounded-[20px] font-regular text-[#636A6D]"
            />
            <Image
              src="/icons/search.svg"
              alt="Search Icon"
              width={24}
              height={24}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50 ml-1"
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
