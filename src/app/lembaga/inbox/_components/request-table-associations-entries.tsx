'use client';

import Image from 'next/image';
import React from 'react';
import { Button } from '~/components/ui/button';

type PermintaanAsosiasiUser = {
  id: string;
  image: string;
  nama: string;
  posisi: string;
  divisi: string;
};

const RequestTableAssociationsEntries: React.FC<{
  data: PermintaanAsosiasiUser[];
}> = ({ data }) => {
  return (
    <div className="flex flex-col rounded-xl pl-1 pb-1 p-4 font-sans">
      {Array.isArray(data) && data.length > 0 ? (
        <>
          <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr] items-center gap-4 border-b border-[#E7E9EC] p-4 font-regular weight-400 text-[18px] text-[#9DA4A8]">
            <div>Nama</div>
            <div className="pl-[50px]">Posisi</div>
            <div className="text-center">Divisi</div>
            <div className="justify-self-end mr-[110px]">Request</div>
          </div>
          {data.map((item, index) => (
            <div
              key={index}
              className={
                'grid grid-cols-[2fr_1fr_1fr_1.5fr] items-center gap-4 p-4 border-b border-[#E7E9EC]'
              }
            >
              <div className="flex items-center gap-4">
                <div className="rounded-full overflow-hidden w-[60px] h-[60px]">
                  <Image
                    src={'/images/miscellaneous/empty-profile-picture.svg'}
                    alt="Profile Picture"
                    width={60}
                    height={60}
                  />
                </div>
                <span className="pl-[20px] text-[18px] font-regular weight-400 text-[#636A6D]">
                  {item?.nama ?? '-'}
                </span>
              </div>
              <div className="text-[18px] -ml-[30px] font-regular weight-400 text-center text-[#636A6D]">
                {item?.posisi ?? '-'}
              </div>
              <div className="text-[18px] font-regular weight-400 text-center text-[#636A6D]">
                {item?.divisi ?? '-'}
              </div>
              <div className="flex items-center justify-end gap-2 weight-700">
                <Button
                  onClick={() =>
                    console.log(
                      `Permintaan untuk divisi ${item?.divisi ?? '-'} ditolak.`,
                    )
                  }
                  className="border-none px-4 py-2 bg-[#FAFAFA] text-[14px] text-[#FF0000] hover:bg-[#FF0000] hover:text-white active:bg-[#FF0000] active:text-white"
                >
                  DECLINE
                </Button>

                <Button
                  onClick={() =>
                    console.log(
                      `Permintaan untuk divisi ${item?.divisi ?? '-'} diterima.`,
                    )
                  }
                  variant="outline"
                  className="rounded-2px border-[#29BC5B] border-[2px] px-4 py-2 bg-[#FAFAFA] text-[14px] text-[#29BC5B] hover:bg-[#29BC5B] hover:text-white"
                >
                  ACCEPT
                </Button>
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <Image
            src="/images/miscellaneous/not-found-association.svg"
            alt="No Data"
            width={140}
            height={140}
            className="mx-auto mt-20"
          />
          <div className="p-4 pb-0 text-center weight-600 font-semibold text-[32px] text-[#768085]">
            Tidak ada permintaan asosiasi
          </div>
          <p className="p-4 pt-0 text-center weight-600 font-regular text-[24px] text-[#C4CACE]">
            Maaf, belum ada permintaan asosiasi yang masuk
          </p>
        </>
      )}
    </div>
  );
};

export default RequestTableAssociationsEntries;
