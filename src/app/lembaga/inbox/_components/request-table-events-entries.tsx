'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '~/components/ui/button';

type PermintaanAsosiasi = {
  id: string;
  image: string;
  nama: string;
  jumlah: string;
  tujuan: string;
};

const RequestTableEventsEntries: React.FC<{ data: PermintaanAsosiasi[] }> = ({
  data,
}) => {
  const router = useRouter();

  const handleButtonClick = (id: string) => {
    router.push(`/lembaga/inbox/${id}`);
  };

  return (
    <div className="flex flex-col rounded-xl pl-1 pb-1 p-4 font-sans">
      {Array.isArray(data) && data.length > 0 ? (
        <>
          <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr] items-center gap-10 border-b border-[#E7E9EC] p-4 font-regular weight-400 text-[18px] text-[#9DA4A8]">
            <div>Nama</div>
            <div className="text-center">Jumlah Permintaan</div>
            <div className="ml-[40px] text-center">Tujuan Asosiasi</div>
            <div className="justify-self-end pr-[12px]">Lihat Permintaan</div>
          </div>

          {data.map((item: PermintaanAsosiasi, index: number) => (
            <div
              key={index}
              className={
                'grid grid-cols-[2fr_1fr_1fr_1.5fr] items-center gap-4 p-4 border-b border-[#E7E9EC]'
              }
            >
              <div className="flex items-center gap-4">
                <div className="rounded-full overflow-hidden w-[60px] h-[60px]">
                  <Image
                    src={item.image}
                    alt="Profile Picture"
                    width={60}
                    height={60}
                  />
                </div>
                <span className="ml-[20px] text-[18px] font-regular weight-400 text-[#636A6D]">
                  {item.nama}
                </span>
              </div>
              <div className="-ml-[20px] text-[18px] font-regular weight-400 text-center text-[#636A6D]">
                {item.jumlah}
              </div>
              <div className="ml-[45px] text-[18px] font-regular weight-400 text-center text-[#636A6D]">
                {item.tujuan}
              </div>
              <div
                key={index}
                className="flex justify-end pr-[28px] font-regular weight-400"
              >
                <Button
                  onClick={() => handleButtonClick(item.id)}
                  variant="outline"
                  className="border-[1px] rounded-[8px] border-[#E0E5E8] h-[44px] w-[94px] px-[10px] bg-[#FAFAFA] text-[18px] text-[#636A6D]"
                >
                  <div className="flex items-center gap-1 mt-[8px] mb-[8px]">
                    <span>Lihat</span>
                    <Image
                      src="/icons/call_made.svg"
                      alt="Icon"
                      width={24}
                      height={24}
                    />
                  </div>
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

export default RequestTableEventsEntries;
